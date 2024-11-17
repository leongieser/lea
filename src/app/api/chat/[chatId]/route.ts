import { NextRequest } from 'next/server';
import prisma from '@/lib/db';
import {
  AIMessage,
  HumanMessage,
  SystemMessage,
  trimMessages,
} from '@langchain/core/messages';
import { StringOutputParser } from '@langchain/core/output_parsers';
import {
  ChatPromptTemplate,
  MessagesPlaceholder,
} from '@langchain/core/prompts';
import { ChatOpenAI } from '@langchain/openai';

export async function POST(
  req: NextRequest,
  { params: { chatId } }: { params: { chatId: string } }
) {
  const { message } = await req.json();

  const data = await prisma.message.create({
    data: {
      content: message,
      role: 'user',
      chat: {
        connect: {
          id: chatId,
        },
      },
    },
    include: {
      chat: {
        include: {
          messages: true,
        },
      },
    },
  });

  const encoder = new TextEncoder();
  const stream = new TransformStream();
  const writer = stream.writable.getWriter();

  const abortController = new AbortController();
  const { signal } = abortController;

  signal.addEventListener('abort', async () => {
    await writer.close();
  });

  let responseContent = '';

  const model = new ChatOpenAI({
    model: 'gpt-4o-mini',
    streaming: true,
    openAIApiKey: process.env.OPENAI_API_KEY,
    // verbose: process.env.NODE_ENV === 'development',
    callbacks: [
      {
        async handleLLMNewToken(token) {
          responseContent += token;
          await writer.ready;
          await writer.write(encoder.encode(`${token}`));
        },
        async handleLLMEnd() {
          await writer.ready;
          await writer.close();

          await prisma.message.create({
            data: {
              content: responseContent,
              role: 'ai',
              chat: {
                connect: {
                  id: chatId,
                },
              },
            },
          });
        },
      },
    ],
  });

  // This is probably terrible for performance
  // but i did not have the time to get into how to set up redis with langchain
  // since v3 is heavily based on LangGraph which would take away a lot of the complexity
  // so that was a nono for the assignment
  const chatHistory = data.chat.messages.map((message) => {
    switch (message.role) {
      case 'system':
        return new SystemMessage({ content: message.content });
      case 'user':
        return new HumanMessage({ content: message.content });
      case 'ai':
        return new AIMessage({ content: message.content });
      default:
        return new HumanMessage({ content: message.content });
    }
  });

  const selectedMessages = await trimMessages(chatHistory, {
    tokenCounter: model,
    maxTokens: 80,
    startOn: 'human',
    strategy: 'last',
    includeSystem: true,
  });

  const prompt = ChatPromptTemplate.fromMessages([
    new MessagesPlaceholder('chatHistory'),
    ['human', message],
  ]);

  const parser = new StringOutputParser();
  const chain = prompt.pipe(model).pipe(parser);

  chain.invoke({ chatHistory: selectedMessages });
  return new Response(stream.readable);
}

export async function GET(
  req: NextRequest,
  { params: { chatId } }: { params: { chatId: string } }
) {
  const chat = await prisma.chat.findFirstOrThrow({
    where: {
      id: chatId,
    },
    include: {
      messages: true,
    },
  });

  console.log(chat);

  if (!chat) {
    return new Response(null, { status: 404 });
  }

  const encoder = new TextEncoder();
  const stream = new TransformStream();
  const writer = stream.writable.getWriter();

  const abortController = new AbortController();
  const { signal } = abortController;

  signal.addEventListener('abort', async () => {
    await writer.close();
  });

  let responseContent = '';

  const model = new ChatOpenAI({
    model: 'gpt-4o-mini',
    streaming: true,
    openAIApiKey: process.env.OPENAI_API_KEY,
    // verbose: process.env.NODE_ENV === 'development',
    callbacks: [
      {
        async handleLLMNewToken(token) {
          responseContent += token;
          await writer.ready;
          await writer.write(encoder.encode(`${token}`));
        },
        async handleLLMEnd() {
          await writer.ready;
          await writer.close();

          await prisma.message.create({
            data: {
              content: responseContent,
              role: 'ai',
              chat: {
                connect: {
                  id: chatId,
                },
              },
            },
          });
        },
      },
    ],
  });

  const chatHistory = chat.messages.map((message) => {
    switch (message.role) {
      case 'system':
        return new SystemMessage({ content: message.content });
      case 'user':
        return new HumanMessage({ content: message.content });
      case 'ai':
        return new AIMessage({ content: message.content });
      default:
        return new HumanMessage({ content: message.content });
    }
  });

  const selectedMessages = await trimMessages(chatHistory, {
    tokenCounter: model,
    maxTokens: 80,
    startOn: 'human',
    strategy: 'last',
    includeSystem: true,
  });

  const prompt = ChatPromptTemplate.fromMessages([
    new MessagesPlaceholder('chatHistory'),
  ]);

  const parser = new StringOutputParser();
  const chain = prompt.pipe(model).pipe(parser);

  chain.invoke({ chatHistory: selectedMessages });
  return new Response(stream.readable);
}

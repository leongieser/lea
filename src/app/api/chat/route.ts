import { NextRequest } from 'next/server';
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

export async function POST(req: NextRequest) {
  // const { message, mode, chatId } = await req.json();
  const { message } = await req.json();

  // if (!mode) mode = 'chat';

  const encoder = new TextEncoder();
  const stream = new TransformStream();
  const writer = stream.writable.getWriter();

  const model = new ChatOpenAI({
    model: 'gpt-4o-mini',
    streaming: true,
    openAIApiKey: process.env.OPENAI_API_KEY,
    verbose: process.env.NODE_ENV === 'development',
    callbacks: [
      {
        async handleLLMNewToken(token) {
          await writer.ready;
          await writer.write(encoder.encode(`${token}`));
        },
        async handleLLMEnd() {
          await writer.ready;
          await writer.close();
        },
      },
    ],
  });

  // get chats

  const chatHistory = [
    new SystemMessage({ content: 'Welcome to the chat' }),
    new HumanMessage({ content: 'Hello' }),
    new AIMessage({ content: 'Hello, how can I help you today?' }),
    new HumanMessage({ content: 'My name is Leon' }),
    new AIMessage({ content: 'ok' }),
  ];

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

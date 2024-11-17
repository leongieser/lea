import { NextRequest } from 'next/server';
import { HumanMessage } from '@langchain/core/messages';
import { ChatOpenAI } from '@langchain/openai';

const runLLMChain = async (message: string) => {
  const encoder = new TextEncoder();
  const stream = new TransformStream();
  const writer = stream.writable.getWriter();

  const model = new ChatOpenAI({
    model: 'gpt-4o-mini',
    streaming: true,
    openAIApiKey: process.env.OPENAI_API_KEY,
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

  model.invoke([new HumanMessage(message)]);

  return stream.readable;
};

export async function POST(req: NextRequest) {
  const { message } = await req.json();

  console.log('message', message);

  const stream = runLLMChain(message);
  return new Response(await stream);
}

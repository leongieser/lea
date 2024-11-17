import { NextRequest } from 'next/server';

export async function POST(req: NextRequest) {
  const { message } = await req.json();

  console.log(message);
  return Response.json({ data: message });
}

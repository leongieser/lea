'use server';

import { notFound, redirect } from 'next/navigation';

import prisma from '../db';

export async function createChat(data: FormData) {
  // TODO cs / ss validation share zod schema
  const message = data.get('message') as string;

  let chat;

  try {
    chat = await prisma.chat.create({
      data: {
        title: message.slice(0, 20) + '...',
        messages: {
          create: [{ content: message, role: 'user' }],
        },
      },
    });
  } catch (error) {
    console.error('Failed to create chat', error);
    redirect(`/?toast=failed-to-create-chat`);
  }

  redirect(`/c/${chat.id}`);
}

export async function deleteChat(chatId: string) {
  try {
    await prisma.chat.delete({ where: { id: chatId } });
  } catch (error) {
    console.error('Chat not found', error);
    redirect(`/c/${chatId}`);
  }

  redirect(`/`);
}

export async function getChat(chatId: string) {
  let chat;

  try {
    chat = await prisma.chat.findUniqueOrThrow({
      where: { id: chatId },
      include: { messages: true },
    });
  } catch (error) {
    console.error(error);
    notFound();
    // TODO rediret to home +toast is better ux
  }

  return chat;
}

export async function getChats() {
  let chats;

  try {
    chats = await prisma.chat.findMany();
  } catch (error) {
    console.error(error);
    notFound();
  }

  return chats;
}

'use server';

import { redirect } from 'next/navigation';

export const createChat = async (data: FormData) => {
  console.log(data.get('message'));
  const chatId = '1';

  redirect(`/c/${chatId}`);
  //TODO
};

export const deleteChat = async (chatId: string) => {
  console.log(chatId);

  redirect('/');
  //TODO
};

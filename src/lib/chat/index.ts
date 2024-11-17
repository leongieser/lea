'use server';

import { redirect } from 'next/navigation';

export const createChat = async (data: FormData) => {
  if (!data.get('message')) {
    return;
  }

  console.log(data.get('message'));
  const chatId = '1';

  redirect(`/c/${chatId}`);
};

export const deleteChat = async (chatId: string) => {
  console.log(chatId);

  redirect('/');
  //TODO
};

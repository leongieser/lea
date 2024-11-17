import { getChat } from '@/lib/chat';

import { Chat } from './Chat';

export default async function ChatPage({
  params: { chatId },
}: {
  params: { chatId: string };
}) {
  const chat = await getChat(chatId);

  return (
    <>
      <Chat chatHistory={chat.messages} chatId={chatId} />;
    </>
  );
}

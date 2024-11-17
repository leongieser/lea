import Link from 'next/link';
import ChatNavLink from '@/components/chat-nav-link';
import { getChats } from '@/lib/chat';
import { PanelLeftCloseIcon, SquarePenIcon } from 'lucide-react';

export default async function SidebarLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const chats = await getChats();

  return (
    <div className="flex h-full max-h-screen bg-zinc-800">
      <div className="hidden h-screen w-[300px] flex-col gap-8 bg-zinc-900 sm:flex">
        <div className="flex w-full justify-between p-4 text-zinc-100">
          <button>
            <PanelLeftCloseIcon className="h-6 w-6" />
            <span className="sr-only">close sidepanel</span>
          </button>

          <Link href="/">
            <SquarePenIcon className="h-6 w-6" />
            <span className="sr-only">new chat</span>
          </Link>
        </div>
        <ul className="flex w-full flex-col gap-4 text-zinc-100">
          {chats.map((chat) => (
            <ChatNavLink chatId={chat.id} title={chat.title} key={chat.id} />
          ))}
        </ul>
      </div>

      {children}
    </div>
  );
}

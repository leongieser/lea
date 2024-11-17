'use client';

import Link from 'next/link';
import { useSidePanel } from '@/hooks/use-side-panel';
import { Chat } from '@prisma/client';
import { PanelLeftCloseIcon, SquarePenIcon } from 'lucide-react';

import ChatNavLink from './chat-nav-link';

export default function SidePanel({ chats }: { chats: Chat[] }) {
  const { isOpen, close } = useSidePanel();

  if (!isOpen) return null;
  return (
    <div className="hidden h-screen w-[300px] flex-col gap-8 bg-zinc-900 sm:flex">
      <div className="flex w-full justify-between p-4 text-zinc-100">
        <button onClick={close}>
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
  );
}

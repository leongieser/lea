'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
// import { usePathname } from 'next/navigation';
import { deleteChat } from '@/lib/chat';
import { cn } from '@/utils';
import * as Popover from '@radix-ui/react-popover';
import { EllipsisVerticalIcon } from 'lucide-react';

export default function ChatNavLink({
  chatId,
  title,
}: {
  chatId: string;
  title: string;
}) {
  const deleteChatById = deleteChat.bind(null, chatId);
  const pathname = usePathname();

  const isActive = pathname === `/c/${chatId}`;
  return (
    <li
      key={chatId}
      className="group flex w-full items-center justify-between transition-colors duration-200 hover:bg-zinc-600"
    >
      {isActive && (
        <span
          className={cn('h-full w-2', isActive ? 'bg-zinc-100' : 'bg-none')}
        />
      )}

      <Link
        className="text-md w-full flex-grow truncate py-2 pl-4 font-normal"
        href={`/c/${chatId}`}
      >
        {title}
      </Link>
      <Popover.Root>
        <Popover.Trigger asChild>
          <button
            className="transition-all duration-200 group-has-[:hover]:opacity-100"
            aria-label="chat options"
          >
            <EllipsisVerticalIcon />
          </button>
        </Popover.Trigger>
        <Popover.Portal>
          <Popover.Content
            className="rounded-md bg-zinc-600 p-3"
            sideOffset={5}
          >
            <form action={deleteChatById}>
              <button
                className="rounded-md bg-red-600 px-4 py-2 text-red-200"
                type="submit"
              >
                delete
              </button>
            </form>
          </Popover.Content>
        </Popover.Portal>
      </Popover.Root>
      {/* // TODO delete popover */}
    </li>
  );
}

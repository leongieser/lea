import Link from 'next/link';
import { PanelLeftCloseIcon, SquarePenIcon } from 'lucide-react';

export default async function SidebarLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const chats = [
    { id: '1', title: 'Chat 1' },
    { id: '2', title: 'Chat 2' },
    { id: '3', title: 'Chat 3' },
  ];

  return (
    <div className="flex min-h-screen bg-zinc-800">
      <div className="hidden h-screen w-[300px] flex-col gap-8 bg-zinc-900 sm:flex">
        <div className="flex w-full justify-between p-4 text-zinc-100">
          <Link href="/">
            <SquarePenIcon className="h-6 w-6" />
            <span className="sr-only">new chat</span>
          </Link>

          <button>
            <PanelLeftCloseIcon className="h-6 w-6" />
            <span className="sr-only">close sidepanel</span>
          </button>
        </div>

        <ul className="flex w-full flex-col gap-4 px-4 text-zinc-100">
          {/* // TODO active chat indicator */}
          {chats.map((chat) => (
            <li
              key={chat.id}
              className="group flex w-full items-center rounded-md px-2 py-1 transition-colors duration-200 hover:bg-zinc-600"
            >
              <Link
                className="text-md w-full flex-grow font-normal"
                href={`/c/${chat.id}`}
              >
                {chat.title}
              </Link>
              <span>...</span>
              {/* // TODO delete popover */}
            </li>
          ))}
        </ul>
      </div>

      <div className="relative flex h-screen w-full">{children}</div>
    </div>
  );
}

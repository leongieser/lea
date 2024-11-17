import SidePanel from '@/components/sidepanel';
import SidePanelOpener from '@/components/sidepanel-button';
import { getChats } from '@/lib/chat';

export default async function SidebarLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const chats = await getChats();

  return (
    <div className="flex h-full max-h-screen bg-zinc-800">
      <SidePanel chats={chats} />
      <SidePanelOpener />
      {children}
    </div>
  );
}

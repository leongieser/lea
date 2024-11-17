export default function ChatPage({
  params: { chatId },
}: {
  params: { chatId: string };
}) {
  // TODO get existing chat messages
  // TODO pass to chat component
  // TODO create client message form
  return (
    <div className="container flex h-full flex-col-reverse items-center justify-center bg-teal-400">
      <h1>Chat Page</h1>
      {chatId}
    </div>
  );
}

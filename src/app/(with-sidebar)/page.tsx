import { MessageForm } from '@/components/message-form';

export default function Home() {
  return (
    <main className="w-full">
      <div className="container relative mx-auto flex h-full min-h-screen w-full flex-col items-center justify-end px-4 pb-4 md:justify-center md:px-4">
        <MessageForm />
      </div>
    </main>
  );
}

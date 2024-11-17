import { SendHorizontal } from 'lucide-react';

export default function Home() {
  return (
    <main className="w-full">
      <div className="container relative mx-auto flex h-full min-h-screen w-full flex-col items-center justify-end px-4 pb-8 md:justify-center md:px-4">
        <form className="mx-auto flex w-full max-w-2xl self-stretch rounded-md bg-zinc-900 text-zinc-100">
          <textarea
            name="message"
            placeholder="Teach me something new today..."
            className="without-ring flex max-h-[400px] w-full resize-none justify-center overflow-hidden rounded-l-md bg-zinc-900 p-4 text-lg"
            rows={1}
          />
          <div className="flex h-full grow items-center">
            <button
              type="submit"
              className="flex h-10 w-10 items-center justify-center text-zinc-50"
            >
              <SendHorizontal className="h-6 w-6" />

              <span className="sr-only">Send message</span>
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}

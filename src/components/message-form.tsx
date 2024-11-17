import { createChat } from '@/lib/chat';
import { SendHorizontal } from 'lucide-react';

export const MessageForm = () => {
  return (
    <form
      action={createChat}
      className="mx-auto flex w-full max-w-screen-sm self-stretch rounded-md bg-zinc-900 text-zinc-100"
    >
      <textarea
        name="message"
        placeholder="Teach me something new today..."
        className="without-ring flex max-h-[400px] w-full resize-none justify-center overflow-hidden rounded-l-md bg-zinc-900 p-4 text-lg"
        rows={3}
      />
      <div className="flex h-full grow items-end">
        <button
          type="submit"
          className="flex h-12 w-12 items-center justify-center text-zinc-50"
        >
          <SendHorizontal className="h-6 w-6" />

          <span className="sr-only">Send message</span>
        </button>
      </div>
    </form>
  );
};

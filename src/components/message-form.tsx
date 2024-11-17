import { createChat } from '@/lib/chat';
import { SendHorizontal } from 'lucide-react';

export const MessageForm = () => {
  return (
    <form
      action={createChat}
      className="mx-auto flex w-full max-w-screen-sm flex-col gap-4 self-stretch text-zinc-100"
    >
      <div className="flex rounded-md bg-zinc-900">
        <textarea
          name="message"
          placeholder="Teach me something new today..."
          className="without-ring flex max-h-[400px] w-full resize-none justify-center overflow-hidden rounded-l-md bg-zinc-900 p-4 text-lg"
          rows={1}
        />
        <div className="flex h-full grow items-center">
          <button
            type="submit"
            className="flex h-full w-full items-center justify-center px-4 text-zinc-50 disabled:pointer-events-none disabled:opacity-50"
          >
            <SendHorizontal className="h-6 w-6" />
            <span className="sr-only">Send message</span>
          </button>
        </div>
      </div>
    </form>
  );
};

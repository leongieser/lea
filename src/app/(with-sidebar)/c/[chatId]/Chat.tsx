'use client';

import { useEffect, useRef, useState } from 'react';
import { cn } from '@/utils';
import { SendHorizontal } from 'lucide-react';

export type Message = { id: string; text: string; role: 'user' | undefined };

export const Chat = ({
  chatHistory,
  chatId,
}: {
  chatHistory: Message[];
  chatId: string;
}) => {
  console.log(chatId);
  // TODO message format
  //? message role user / !user
  const [messages, setMessages] = useState<Message[]>(chatHistory);
  const [newMessage, setNewMessage] = useState('');
  const [streamResponse, setStreamResponse] = useState('');
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const [paddingClass, setPaddingClass] = useState('pl-0');

  const scrollToBottom = () => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTo({
        top: messagesContainerRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  };

  useEffect(() => {
    const checkOverflow = () => {
      const container = messagesContainerRef.current;
      if (container) {
        if (
          container.scrollHeight > container.clientHeight ||
          container.scrollWidth > container.clientWidth
        ) {
          setPaddingClass('pl-4');
        } else {
          setPaddingClass('pr-0');
        }
      }
    };

    checkOverflow();
    window.addEventListener('resize', checkOverflow);
    return () => {
      window.removeEventListener('resize', checkOverflow);
    };
  }, []);

  useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop =
        messagesContainerRef.current.scrollHeight;
    }
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [streamResponse, messages]);

  const handleMessageSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    //? fire and forget
    //? optimistic update
    //? saved message format must match

    const userMessage = e.currentTarget.message.value;
    setMessages((prevMessages) => [
      ...prevMessages,
      {
        id: prevMessages.length.toString(),
        text: userMessage,
        role: 'user',
      },
    ]);

    e.currentTarget.reset();

    const response = await fetch('/api/chat', {
      method: 'POST',
      body: JSON.stringify({
        message: userMessage,
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.body) return;

    const reader = response.body.getReader();

    let accumulatedResponse = '';
    while (true) {
      const { done, value } = await reader.read();

      if (done) {
        setMessages((prevMessages) => [
          ...prevMessages,
          {
            id: prevMessages.length.toString(),
            text: accumulatedResponse,
            role: undefined,
          },
        ]);
        setStreamResponse('');
        break;
      }

      const text = new TextDecoder().decode(value);
      accumulatedResponse += text;

      setStreamResponse(accumulatedResponse);
    }
  };

  return (
    <div className="container flex h-full flex-col items-center justify-start gap-6 py-4">
      <section
        ref={messagesContainerRef}
        className={cn(
          'container overflow-y-auto [&::-webkit-scrollbar-track]:bg-zinc-800',
          paddingClass
        )}
      >
        <ol className="mx-auto flex max-w-screen-sm flex-col gap-2">
          {messages.map((message) => (
            <li
              className={cn(
                'flex w-full',
                message.role !== 'user' && 'justify-end'
              )}
              key={message.id + message.text}
            >
              <span className="rounded-md bg-zinc-600 px-4 py-2 text-white">
                {message.text}
              </span>
            </li>
          ))}
          {streamResponse && (
            <li className="flex w-full justify-end">
              <span className="rounded-md bg-zinc-600 px-4 py-2 text-white">
                {streamResponse}
              </span>
            </li>
          )}
        </ol>
      </section>
      <form
        onSubmit={handleMessageSubmit}
        className="mx-auto flex w-full max-w-screen-sm self-stretch rounded-md bg-zinc-900 text-zinc-100"
      >
        <textarea
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          name="message"
          placeholder="Teach me something new today..."
          className="without-ring flex max-h-[400px] w-full resize-none justify-center overflow-hidden rounded-l-md bg-zinc-900 p-4 text-lg"
          rows={1}
        />
        <div className="flex h-full grow items-center">
          <button
            disabled={!newMessage}
            type="submit"
            className="flex h-full w-full items-center justify-center px-4 text-zinc-50 disabled:pointer-events-none disabled:opacity-50"
          >
            <SendHorizontal className="h-6 w-6" />
            <span className="sr-only">Send message</span>
          </button>
        </div>
      </form>
    </div>
  );
};

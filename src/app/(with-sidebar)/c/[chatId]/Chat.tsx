'use client';

import type { Message } from '@prisma/client';

import { useEffect, useRef, useState } from 'react';
import { cn } from '@/utils';
import { SendHorizontal, StopCircleIcon } from 'lucide-react';

/**
 *
 * @comment There is quite a bit of duplication regarding the chat history and the chat id.
 * Iwas not sure how i should implement the buffering when i am simply restreaming directly. a loading state is probably better?
 * Once the llm is going it usually dont slows down.
 *
 * The plan was to move the streaming logic into a useStream hook but i am about 45 min over now and it is sunday
 *
 * Sadly the langchain docs (v3) promote Langgraph a lot in their docs so i could not get the clearest path
 *
 * I think if i had gone with react19 and next 15 i could have used the "use" hook and pass down the promise with the streaming response.
 * That might be interesting to see in the future
 *
 * I have been working so much with server componentts that it was weird to get back into client side state.
 *
 * The currnent flow of the data goes like this
 *
 * The user submits a message on the landing page.
 * This creates a new chat with this message being the first and only
 * The user is then redirected to the chat page with the new chatid as a param
 * The server component fetches the chat history and passes it down to the chat client component
 * The chat component has a ref flag that checks if the first message has been sent
 * If not - the first message is being sent to the endpoint which gets a streaming response from the llm
 * when the response is done a callback saves the new message to the database with the role "ai"
 * While the message is being streamed to the client it is displayed in the chat and once the stream is done the message is added to the
 * in memory client side chat history.
 * Refreshing the page will cause the server component to get the updated chat history and pass it into the client component
 *
 * i ran into some scrollbar chaos in the end and really did not have the nerve to fix it. soooorrry
 */
export const Chat = ({
  chatHistory,
  chatId,
}: {
  chatHistory: Message[];
  chatId: string;
}) => {
  const [messages, setMessages] =
    useState<Pick<Message, 'content' | 'role' | 'id'>[]>(chatHistory);
  const [newMessage, setNewMessage] = useState('');
  const [streamResponse, setStreamResponse] = useState('');
  const [paddingClass, setPaddingClass] = useState('pl-0');
  const [isThinking, setIsThinking] = useState(false);
  const [controller, setController] = useState<AbortController | null>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const hasSentInitalMessage = useRef(false);
  const scrollToBottom = () => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTo({
        top: messagesContainerRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  };
  useEffect(() => {
    scrollToBottom();
  }, [messages, streamResponse]);

  useEffect(() => {
    const checkOverflow = () => {
      const container = messagesContainerRef.current;
      if (container) {
        if (container.scrollHeight > container.clientHeight) {
          setPaddingClass('pl-4');
        } else {
          setPaddingClass('pr-0');
        }
      }
    };
    checkOverflow();
    scrollToBottom();
    window.addEventListener('resize', checkOverflow);
    return () => {
      window.removeEventListener('resize', checkOverflow);
    };
  }, []);

  useEffect(() => {
    const initConversation = async () => {
      if (messages.length > 1 || hasSentInitalMessage.current) return;

      hasSentInitalMessage.current = true;

      const abortController = new AbortController();
      setController(abortController);

      try {
        const response = await fetch('/api/chat', {
          method: 'POST',
          body: JSON.stringify({
            message: messages[0].content,
            chatId,
          }),
          headers: {
            'Content-Type': 'application/json',
          },
          signal: abortController.signal,
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
                content: accumulatedResponse,
                role: 'ai',
              },
            ]);
            break;
          }

          const text = new TextDecoder().decode(value);
          accumulatedResponse += text;
          setStreamResponse(accumulatedResponse);
        }

        setStreamResponse('');
      } catch (error) {
        if (error instanceof DOMException && error.name === 'AbortError') {
          console.log('Streaming aborted');
        } else {
          console.error('Error during streaming:', error);
        }
      }
    };

    initConversation();
  }, [messages, chatId]);

  const handleMessageSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsThinking(true);

    setMessages((prevMessages) => [
      ...prevMessages,
      {
        id: prevMessages.length.toString(),
        content: newMessage,
        role: 'user',
      },
    ]);

    setNewMessage('');

    const response = await fetch('/api/chat', {
      method: 'POST',
      body: JSON.stringify({
        message: newMessage,
        chatId,
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
            content: accumulatedResponse,
            role: 'ai',
          },
        ]);
        break;
      }

      const text = new TextDecoder().decode(value);
      accumulatedResponse += text;
      setIsThinking(false);
      setStreamResponse(accumulatedResponse);
    }

    setStreamResponse('');
    return () => {
      if (controller) {
        controller.abort();
      }
    };
  };

  const stopResponse = () => {
    if (controller) {
      controller.abort();
      setController(null);
      setStreamResponse('');
      setIsThinking(false);
    }
  };

  return (
    <main className="container flex max-h-full flex-col gap-4 bg-zinc-800 px-4 py-4 md:px-0">
      <section
        ref={messagesContainerRef}
        className={cn(
          'scrollbar-custom flex h-full max-h-full w-full items-end overflow-y-auto',
          paddingClass
        )}
      >
        <ol className="mx-auto flex min-h-full w-full max-w-screen-sm flex-col justify-end gap-2">
          {messages.map((message) => (
            <li
              className={cn(
                'relative flex w-full',
                message.role !== 'user' && 'justify-end'
              )}
              key={message.id}
            >
              <span className="relative overflow-hidden rounded-md bg-zinc-600 px-4 py-2 text-white">
                {message.content}
                <span
                  className={cn(
                    'absolute h-full w-2',
                    message.role !== 'user'
                      ? 'right-0 top-0 bg-teal-400'
                      : 'left-0 top-0 bg-fuchsia-400'
                  )}
                />
              </span>
            </li>
          ))}
          {isThinking && (
            // TODO make pretty
            <li className="flex w-full justify-end pt-4">
              <div
                role="status"
                className="flex max-w-sm animate-pulse flex-col items-end justify-end"
              >
                <div className="h-10 w-56 rounded-md bg-zinc-600"></div>

                <span className="sr-only">Loading...</span>
              </div>
            </li>
          )}
          {streamResponse && (
            <li className="flex w-full justify-end">
              {streamResponse && (
                <span className="rounded-md bg-zinc-600 px-4 py-2 text-white">
                  {streamResponse}
                </span>
              )}
            </li>
          )}
        </ol>
      </section>
      <form
        onSubmit={handleMessageSubmit}
        className="mx-auto mt-auto flex w-full max-w-screen-sm self-stretch rounded-md bg-zinc-900 text-zinc-100"
      >
        <textarea
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          name="message"
          placeholder="Your message..."
          className="without-ring flex max-h-[400px] w-full resize-none justify-center overflow-hidden rounded-l-md bg-zinc-900 p-4 text-lg"
          rows={1}
        />
        <div className="flex h-full grow items-center">
          {streamResponse ? (
            <button
              onClick={stopResponse}
              disabled={!streamResponse}
              type="submit"
              className="flex h-full w-full items-center justify-center px-4 text-zinc-50 disabled:pointer-events-none disabled:opacity-50"
            >
              <StopCircleIcon className="h-6 w-6" />
              <span className="sr-only">Stop response</span>
            </button>
          ) : (
            <button
              disabled={!newMessage}
              type="submit"
              className="flex h-full w-full items-center justify-center px-4 text-zinc-50 disabled:pointer-events-none disabled:opacity-50"
            >
              <SendHorizontal className="h-6 w-6" />
              <span className="sr-only">Send message</span>
            </button>
          )}
        </div>
      </form>
    </main>
  );
};

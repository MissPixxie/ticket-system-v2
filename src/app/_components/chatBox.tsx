"use client";

import { useState, useEffect } from "react";
import { api, type RouterOutputs } from "~/trpc/react";
import { useSocket } from "../socketProvider";

interface ChatBoxProps {
  conversationId: string;
}

export default function ChatBox({ conversationId }: ChatBoxProps) {
  const { socket } = useSocket();
  const [newMessage, setNewMessage] = useState("");

  const utils = api.useUtils();
  const { data: me } = api.user.me.useQuery();

  const { data: messages, isLoading } = api.message.listMessages.useQuery({
    conversationId: conversationId,
  });

  const sortedMessages = messages ?? [];

  const createMessage = api.message.createMessage.useMutation({
    onSuccess: () => {
      console.log(
        "Message created, invalidating messages for id:",
        conversationId,
      );

      utils.message.listMessages.invalidate();
      utils.message.listUserConversations.invalidate();
    },
  });

  useEffect(() => {
    if (!socket) return;

    const handler = (msg: { conversationId: string }) => {
      if (msg.conversationId === conversationId) {
        utils.message.listMessages.invalidate();
      }
    };

    socket.on("chat:message", handler);
    return () => {
      socket.off("chat:message", handler);
    };
  }, [socket, conversationId, utils.message.listMessages]);

  const handleSend = () => {
    if (!newMessage.trim()) return;

    createMessage.mutate({ conversationId, content: newMessage });
    socket?.emit("chat:message", { conversationId });
    setNewMessage("");
  };

  return (
    <div className="flex flex-col gap-4">
      <h3 className="text-lg font-semibold">Meddelanden</h3>

      <div className="flex max-h-64 flex-col gap-3 overflow-y-auto rounded-lg bg-black/30 p-4">
        {isLoading ? (
          <p className="animate-pulse text-sm opacity-60">
            Laddar meddelanden...
          </p>
        ) : (
          <>
            {(!messages || messages.length === 0) && (
              <p className="text-sm opacity-60">Inga meddelanden ännu</p>
            )}

            {sortedMessages.map((msg) => {
              const isMine = msg.sender?.id === me?.id;

              return (
                <div
                  key={msg.id}
                  className={`flex min-w-50 flex-col rounded-lg p-3 text-sm ${
                    isMine
                      ? "ml-auto bg-blue-600 text-white"
                      : "mr-auto bg-white/10 text-white"
                  }`}
                >
                  <div className="mb-1 text-xs opacity-60">
                    {msg.createdAt.toLocaleDateString()} ·{" "}
                    {msg.createdAt.toLocaleTimeString()}
                  </div>
                  {msg.content}
                </div>
              );
            })}
          </>
        )}
      </div>

      <div className="flex gap-2">
        <textarea
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Skriv ett meddelande..."
          rows={3}
          className="flex-1 resize-none rounded-lg bg-black/30 p-3 text-sm outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button onClick={handleSend} className="submit-button">
          Skicka
        </button>
      </div>
    </div>
  );
}

"use client";

import { useState, useEffect } from "react";
import { api, type RouterOutputs } from "~/trpc/react";
import { useSocket } from "../socketProvider";
import { getCurrentUserId } from "./getCurrentUserId";

type TicketList = RouterOutputs["ticket"]["listAllTickets"];
type Ticket = TicketList["tickets"][number];

interface ChatBoxProps {
  id: string;
  currentUserId: string | undefined;
}

export default function ChatBox({ id, currentUserId }: ChatBoxProps) {
  const { socket } = useSocket();
  const [newMessage, setNewMessage] = useState("");

  const utils = api.useUtils();

  const { data: messages, isLoading } = api.message.listMessages.useQuery({
    id,
  });

  const sortedMessages = messages ? [...messages].reverse() : [];

  const createMessage = api.message.createMessage.useMutation({
    onSuccess: () => {
      utils.message.listMessages.invalidate({ id });
      setNewMessage("");
    },
  });

  useEffect(() => {
    if (!socket) return;

    const handler = (msg: { id: string }) => {
      if (msg.id === id) {
        utils.message.listMessages.invalidate({ id });
      }
    };

    socket.on("chat:message", handler);
    return () => {
      socket.off("chat:message", handler);
    };
  }, [socket, id, utils.message.listMessages]);

  const handleSend = () => {
    if (!newMessage.trim()) return;

    createMessage.mutate({ id, message: newMessage });

    socket?.emit("chat:message", { id });
    setNewMessage("");
  };

  return (
    <div className="flex flex-col gap-4">
      <h3 className="text-lg font-semibold">Meddelanden</h3>

      <div className="flex max-h-64 flex-col-reverse gap-3 overflow-y-auto rounded-lg bg-black/30 p-4">
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
              const isMine = msg.createdBy?.id === currentUserId;

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
                  {msg.message}
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
        <button
          onClick={handleSend}
          className="cursor-pointer rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium shadow-md/20 hover:bg-blue-700"
        >
          Skicka
        </button>
      </div>
    </div>
  );
}

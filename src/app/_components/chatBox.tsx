"use client";

import { useState, useEffect, useRef } from "react";
import { api } from "~/trpc/react";
import { useSocket } from "../socketProvider";
import FeedbackBubble from "./feedbackBubble";
import { GenerateNewsletterButton } from "./modals/generate-newsletter/generateNewsletterButton";

interface ChatBoxProps {
  conversationId: string;
  context: "TICKET" | "RESOURCE" | "NEWS" | "QUESTION" | "EMAIL";
  suggestion?: string;
}

interface Newsletter {
  subject: string;
  body: string;
}

export default function ChatBox({
  conversationId,
  context,
  suggestion,
}: ChatBoxProps) {
  const { socket } = useSocket();
  const [newMessage, setNewMessage] = useState("");
  const [newsletterOpen, setNewsletterOpen] = useState(false);
  const [newsletter, setNewsletter] = useState<Newsletter | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const utils = api.useUtils();
  const { data: me } = api.user.me.useQuery();

  useEffect(() => {
    if (suggestion) {
      setNewMessage(suggestion);
    }
  }, [suggestion]);

  const { data: messages, isLoading } = api.message.listMessages.useQuery({
    conversationId: conversationId,
  });

  const generateNewsletter = api.ai.generateConversationSummary.useMutation({
    onSuccess(data) {
      setNewsletter(data.newsletter);
      setNewsletterOpen(true);
    },
  });

  const sortedMessages = messages ?? [];

  const createMessage = api.message.createMessage.useMutation({
    onSuccess: () => {
      void utils.message.listMessages.invalidate();
      void utils.message.listUserConversations.invalidate();

      socket?.emit("chat:message", { conversationId });
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

    createMessage.mutate({
      conversationId,
      content: newMessage,
      context,
    });

    setNewMessage("");
  };

  useEffect(() => {
    if (!socket || !conversationId) return;

    console.log(`📥 Går med i conversation room: ${conversationId}`);

    socket.emit("join:room", conversationId);
  }, [socket, conversationId]);

  useEffect(() => {
    if (!messages) return;

    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages]);

  return (
    <div className="flex flex-col gap-4">
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

            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      <div className="flex gap-2">
        <textarea
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Skriv ett meddelande..."
          rows={3}
          className="input flex-1 resize-none rounded-lg p-3 text-sm"
        />
        <button onClick={handleSend} className="submit-button">
          Skicka
        </button>
      </div>
      {context === "EMAIL" && (
        <GenerateNewsletterButton conversationId={conversationId} />
      )}
      {generateNewsletter.isPending && (
        <FeedbackBubble
          open={generateNewsletter.isPending}
          message="✨ AI skriver nyhetsbrev..."
          onClose={() => {}}
        />
      )}
    </div>
  );
}

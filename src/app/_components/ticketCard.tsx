import { useState } from "react";
import { getSession } from "~/server/better-auth/server";
import { api } from "~/trpc/react";

type TicketProps = {
  id: string;
  title: string;
  issue: string;
  image?: string | null;
  department: string;
  status: string;
  priority: string;
  createdAt: Date;
  updatedAt: Date;
  solvedAt?: Date | null;
  createdBy?: string | null;
  assignedTo?: string | null;
  ticketHistory?: Array<{
    updatedAt: Date;
    updatedBy: string;
  }>;
  messages?: Array<{
    createdBy: string;
    message: string;
    createdAt: Date;
  }>;
};

export default function TicketCard(ticketProps: TicketProps) {
  const [newMessage, setNewMessage] = useState("");
  const utils = api.useUtils();
  const { data: message, isLoading } = api.message.listAllMessages.useQuery({
    ticketId: ticketProps.id,
  });

  const createMessage = api.message.createMessage.useMutation({
    onSuccess: () => {
      void utils.message.listAllMessages.invalidate({
        ticketId: ticketProps.id,
      });
      setNewMessage("");
    },
  });

  const handleSend = () => {
    if (!newMessage.trim()) return;
    createMessage.mutate({
      ticketId: ticketProps.id,
      message: newMessage,
    });

    setNewMessage("");
  };

  return (
    <div className="space-y-6">
      <div>
        <p> {ticketProps.createdAt.toLocaleDateString()}</p>
        <p>
          <strong>Titel:</strong> {ticketProps.title}
        </p>
        <p>
          <strong>Beskrivning:</strong> {ticketProps.issue}
        </p>
      </div>
      <div className="flex flex-col gap-4">
        <h3 className="text-lg font-semibold">Meddelanden</h3>

        <div className="flex max-h-64 flex-col gap-3 overflow-y-auto rounded-lg bg-black/30 p-4">
          {isLoading ? (
            <p className="animate-pulse text-sm opacity-60">
              Laddar meddelanden...
            </p>
          ) : (
            <>
              {(!message || message.length === 0) && (
                <p className="text-sm opacity-60">Inga meddelanden ännu</p>
              )}

              {message?.map((msg, index) => (
                <div
                  key={index}
                  className="max-w-[80%] rounded-lg bg-white/10 p-3 text-sm"
                >
                  <div className="mb-1 text-xs opacity-60">
                    {msg.createdBy?.name} · {msg.createdAt.toLocaleDateString()}
                  </div>
                  {msg.message}
                </div>
              ))}
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
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium hover:bg-blue-700"
          >
            Skicka
          </button>
        </div>
      </div>
    </div>
  );
}

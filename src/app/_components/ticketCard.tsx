import { useState } from "react";
import { api } from "~/trpc/react";
import { TiDocumentText } from "react-icons/ti";
import type { RouterOutputs } from "~/trpc/react";
import { TicketHistory } from "./ticketHistory";

type Ticket = RouterOutputs["ticket"]["listAllTickets"][number];

type TicketCardProps = Ticket;

export default function TicketCard(ticketProps: TicketCardProps) {
  const [newMessage, setNewMessage] = useState("");
  const [showHistory, setShowHistory] = useState(false);
  const utils = api.useUtils();
  const { data: message, isLoading } = api.message.listAllMessages.useQuery({
    ticketId: ticketProps.id,
  });

  const updateTicket = api.ticket.updateTicket.useMutation({
    onSuccess: (updatedTicket) => {
      utils.ticket.listAllTickets.setData(undefined, (oldData) => {
        if (!oldData) return [];
        return oldData.map((ticket) =>
          ticket.id === updatedTicket.id
            ? { ...ticket, ...updatedTicket }
            : ticket,
        );
      });
    },
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

  const handleSetStatus = (ticketId: string, status: string) => {
    updateTicket.mutate({
      id: ticketId,
      status: status as "OPEN" | "IN_PROGRESS" | "CLOSED",
    });
  };

  const handleSetPriority = (ticketId: string, priority: string) => {
    updateTicket.mutate({
      id: ticketId,
      priority: priority as "LOW" | "MEDIUM" | "URGENT",
    });
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
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium shadow-md/20 hover:bg-blue-700"
          >
            Skicka
          </button>
        </div>
        <div className="mt-4 flex flex-row gap-4">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold">Status</label>
            <select
              value={ticketProps.status}
              onClick={(e) => e.stopPropagation()}
              onChange={(e) => handleSetStatus(ticketProps.id, e.target.value)}
              className="rounded bg-gray-700 px-3 py-2 text-white shadow-md/20"
            >
              <option>OPEN</option>
              <option>IN PROGRESS</option>
              <option>CLOSED</option>
            </select>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold">Prioritet</label>
            <select
              value={ticketProps.priority}
              onClick={(e) => e.stopPropagation()}
              onChange={(e) =>
                handleSetPriority(ticketProps.id, e.target.value)
              }
              className="rounded bg-gray-700 px-3 py-2 text-white shadow-md/20"
            >
              <option>LOW</option>
              <option>MEDIUM</option>
              <option>URGENT</option>
            </select>
          </div>
          <div className="ml-auto self-end">
            <button
              className="flex flex-row rounded bg-gray-700 p-2 shadow-md/20 hover:bg-gray-600"
              title="Ticket History"
            >
              Ticket History
              <TiDocumentText className="self-center" size={22} />
            </button>
          </div>
        </div>
        {showHistory && (
          <TicketHistory
            actions={ticketProps.ticketHistories}
            onClose={() => setShowHistory(false)}
          />
        )}
      </div>
    </div>
  );
}

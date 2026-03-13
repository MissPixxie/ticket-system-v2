"use client";

import { useState } from "react";
import { api } from "~/trpc/react";
import { TiDocumentText } from "react-icons/ti";
import type { RouterOutputs } from "~/trpc/react";
import { TicketHistory } from "./ticketHistory";
import ChatBox from "./chatBox";
import { InviteSection } from "./invite-user/inviteSection";

type Ticket = RouterOutputs["ticket"]["listAllTickets"][number];

type TicketCardProps = Ticket & { currentUserId: string | null };

export default function TicketCard({
  currentUserId,
  ...ticketProps
}: TicketCardProps) {
  const [showHistory, setShowHistory] = useState(false);
  const utils = api.useUtils();

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
        {currentUserId && (
          <ChatBox {...ticketProps} currentUserId={currentUserId} />
        )}
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
              <option value="IN_PROGRESS">IN PROGRESS</option>
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
          <div className="ml-auto flex flex-row gap-5 self-end">
            <InviteSection ticketId={ticketProps.id} />
            <button
              className="flex flex-row rounded bg-gray-700 p-2 shadow-md/20 hover:bg-gray-600"
              title="Ticket History"
            >
              Ticket History
              <TiDocumentText className="self-center" size={22} />
            </button>
          </div>
        </div>
        {/* {showHistory && (
          <TicketHistory
            actions={ticketProps.ticketHistories}
            onClose={() => setShowHistory(false)}
          />
        )} */}
      </div>
    </div>
  );
}

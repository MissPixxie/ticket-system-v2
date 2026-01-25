"use client";

import { useState } from "react";
import { api } from "~/trpc/react";
import TicketCard from "./ticketCard";

const priorityClasses: Record<string, string> = {
  LOW: "bg-green-500 text-white",
  MEDIUM: "bg-yellow-500 text-black",
  URGENT: "bg-red-600 text-white",
};

const statusClasses: Record<string, string> = {
  OPEN: "bg-blue-500 text-white",
  IN_PROGRESS: "bg-yellow-500 text-black",
  CLOSED: "bg-gray-600 text-white",
};

export function TicketTable() {
  const { data: tickets, isLoading } = api.ticket.listAllTickets.useQuery();
  const utils = api.useContext();
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);

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

  if (isLoading) return <p>Laddar tickets...</p>;
  if (!tickets || tickets.length === 0) return <p>Inga tickets hittades</p>;

  return (
    <div className="mx-auto w-full bg-linear-to-b from-[#3b0e7a] to-[#282a53] shadow-xl/50">
      <div className="grid grid-cols-[1fr_1fr_1fr_1fr_1fr] bg-black/20 p-5 px-2">
        <div>
          <h2 className="text-xl font-bold">Titel</h2>
        </div>
        <div>
          <h2 className="text-xl font-bold">Avdelning</h2>
        </div>
        <div>
          <h2 className="text-xl font-bold">Status</h2>
        </div>
        <div>
          <h2 className="text-xl font-bold">Prioritet</h2>
        </div>
        <div>
          <h2 className="text-xl font-bold">Skapad</h2>
        </div>
      </div>

      {tickets.map((ticket) => (
        <div key={ticket.id} className="border-t">
          <div
            className="grid cursor-pointer grid-cols-[1fr_1fr_1fr_1fr_1fr] items-center p-4 hover:bg-gray-50/5"
            onClick={() =>
              setSelectedTicketId(
                selectedTicketId === ticket.id ? null : ticket.id,
              )
            }
          >
            <div>{ticket.title}</div>
            <div>{ticket.department}</div>
            <div
              className={`flex max-w-20 justify-center rounded-md shadow-md/30 ${
                statusClasses[ticket.status] ?? "text-gray-400"
              }`}
            >
              {ticket.status}
            </div>
            <div
              className={`flex max-w-20 justify-center rounded-md shadow-md/30 ${
                priorityClasses[ticket.priority] ?? "text-gray-400"
              }`}
            >
              {ticket.priority}
            </div>
            <div>{ticket.createdAt.toLocaleDateString()}</div>
          </div>

          {selectedTicketId === ticket.id && (
            <div className="col-span-full mt-3 transition-opacity duration-200">
              <div className="relative rounded bg-black/30 p-4">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedTicketId(null);
                  }}
                  className="absolute top-2 right-2 flex h-8 w-8 items-center justify-center rounded bg-red-600 text-white hover:bg-red-700"
                >
                  ✕
                </button>

                <TicketCard {...ticket} />

                <div className="mt-4 flex gap-4">
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-semibold">Status</label>
                    <select
                      value={ticket.status}
                      onClick={(e) => e.stopPropagation()}
                      onChange={(e) =>
                        handleSetStatus(ticket.id, e.target.value)
                      }
                      className="rounded bg-gray-700 px-3 py-2 text-white"
                    >
                      <option>OPEN</option>
                      <option>IN_PROGRESS</option>
                      <option>CLOSED</option>
                    </select>
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-semibold">Prioritet</label>
                    <select
                      value={ticket.priority}
                      onClick={(e) => e.stopPropagation()}
                      onChange={(e) =>
                        handleSetPriority(ticket.id, e.target.value)
                      }
                      className="rounded bg-gray-700 px-3 py-2 text-white"
                    >
                      <option>LOW</option>
                      <option>MEDIUM</option>
                      <option>URGENT</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

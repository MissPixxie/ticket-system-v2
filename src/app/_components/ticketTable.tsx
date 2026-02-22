"use client";

import { useState } from "react";
import { api } from "~/trpc/react";
import TicketCard from "./ticketCard";
import { useSocket } from "../socketProvider";

const priorityClasses: Record<string, string> = {
  LOW: "bg-green-500 text-white",
  MEDIUM: "bg-yellow-500 text-black",
  URGENT: "bg-red-600 text-white",
};

const statusClasses: Record<string, string> = {
  OPEN: "bg-blue-500 text-white",
  IN_PROGRESS: "bg-amber-400 text-black",
  CLOSED: "bg-gray-600 text-white",
};

export function TicketTable() {
  const { data: tickets, isLoading } = api.ticket.listAllTickets.useQuery();
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>("ALL");
  const { socket } = useSocket();
  const utils = api.useUtils();

  const updateTicket = api.ticket.updateTicket.useMutation({
    onSuccess: async (ticket) => {
      await utils.ticket.invalidate();
      if (!socket) return;
      socket.emit("join:room", ticket.id);
    },
  });

  const handleSetStatus = (ticketId: string) => {
    updateTicket.mutate({
      id: ticketId,
      status: "IN_PROGRESS",
    });
  };

  const handleSetFilter = (filter: string) => {
    // Logik för att uppdatera filter och hämta nya data baserat på det
  };

  if (isLoading) return <p>Laddar tickets...</p>;
  if (!tickets || tickets.length === 0) return <p>Inga tickets hittades</p>;

  return (
    <div className="mx-auto w-full bg-linear-to-b from-[#3b0e7a] to-[#282a53] shadow-xl/50">
      <div className="flex flex-row gap-7 p-2">
        <div className="flex flex-row items-center justify-center gap-3">
          <h2 className="text-xl font-bold">Filter</h2>
          <select
            value={filter}
            onClick={(e) => e.stopPropagation()}
            onChange={(e) => handleSetFilter(e.target.value)}
            className="rounded bg-gray-700 px-3 py-2 text-white shadow-md/20"
          >
            <option value="ALL">Alla</option>
            <option value="MINA">Mina tickets</option>
            <option value="OPEN">Öppna</option>
            <option value="IN_PROGRESS">Pågående</option>
            <option value="CLOSED">Stängda</option>
          </select>
        </div>
        <div className="flex flex-row items-center justify-center gap-3">
          <h2 className="text-xl font-bold">Sök</h2>
          <input
            type="text"
            placeholder="Sök tickets..."
            className="rounded bg-gray-700 px-3 py-2 text-white shadow-md/20"
          />
        </div>
      </div>
      <div className="grid grid-cols-[1fr_1fr_1fr_1fr_1fr_1fr] bg-black/20 p-5 px-2">
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
        <div>
          <h2 className="text-xl font-bold">Hanteras av</h2>
        </div>
      </div>

      {tickets.map((ticket) => (
        <div key={ticket.id} className="border-t">
          <div
            className="grid cursor-pointer grid-cols-[1fr_1fr_1fr_1fr_1fr_1fr] items-center p-4 hover:bg-gray-50/5"
            onClick={() =>
              setSelectedTicketId(
                selectedTicketId === ticket.id ? null : ticket.id,
              )
            }
          >
            <div>{ticket.title}</div>
            <div>{ticket.department}</div>
            <div
              className={`flex max-w-28 justify-center rounded-md shadow-md/30 ${
                statusClasses[ticket.status] ?? "text-gray-400"
              }`}
            >
              {ticket.status.replace("_", " ")}
            </div>
            <div
              className={`flex max-w-20 justify-center rounded-md shadow-md/30 ${
                priorityClasses[ticket.priority] ?? "text-gray-400"
              }`}
            >
              {ticket.priority}
            </div>
            <div>{ticket.createdAt.toLocaleDateString()}</div>
            <div>
              {ticket.assignedTo?.name ?? (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSetStatus(ticket.id);
                  }}
                  className="rounded-lg border-2 border-blue-500 bg-blue-200/30 px-10 py-3 text-white shadow-md hover:bg-blue-500"
                >
                  Acceptera
                </button>
              )}
            </div>
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
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

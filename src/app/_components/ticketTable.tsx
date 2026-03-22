"use client";

import { useState } from "react";
import { api } from "~/trpc/react";
import TicketCard from "./ticketCard";
import { useSocket } from "../socketProvider";
import { TicketSection } from "./create-ticket/ticketSection";

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

interface TicketTableProps {
  currentUserId: string | null;
  currentUserRole: "ADMIN" | "HANDLER" | "USER";
}

export function TicketTable({ currentUserId, currentUserRole }: TicketTableProps) {
  const { data: tickets, isLoading } = api.ticket.listAllTickets.useQuery({ limit: 20});
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>("ALL");
  const [search, setSearch] = useState("");
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

  const handleSetFilter = (value: string) => {
    setFilter(value);
  };

  const filteredTickets = tickets?.tickets.filter((ticket) => {
    const userId = currentUserId;
    switch (filter) {
      case "MINA":
        return ticket.assignedTo?.id === userId;
      case "OPEN":
        return ticket.status === "OPEN";
      case "IN_PROGRESS":
        return ticket.status === "IN_PROGRESS";
      case "CLOSED":
        return ticket.status === "CLOSED";
      default:
        return true;
    }
  });

  const visibleTickets = filteredTickets?.filter((ticket) => {
    const searchLower = search.toLowerCase();
    return (
      ticket.title.toLowerCase().includes(searchLower) ||
      ticket.status.toLowerCase().includes(searchLower) ||
      ticket.priority.toLowerCase().includes(searchLower) ||
      ticket.department.toLowerCase().includes(searchLower) ||
      ticket.assignedTo?.name?.toLowerCase().includes(searchLower)
    );
  });

  if (isLoading) return <p>Laddar tickets...</p>;
  if (!tickets || tickets.tickets.length === 0) return <p>Inga tickets hittades</p>;

  return (
    <div className="mt-15 rounded-2xl bg-white/5 shadow-lg/15 backdrop-blur-lg">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 p-5">
        <div className="flex items-center gap-4">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="rounded-lg bg-white/10 px-3 py-2 text-sm"
          >
            <option value="ALL" className="text-black">
              Alla
            </option>
            <option value="OPEN" className="text-black">
              Öppna
            </option>
            <option value="IN_PROGRESS" className="text-black">
              Pågående
            </option>
            <option value="CLOSED" className="text-black">
              Stängda
            </option>
          </select>

          <input
            type="text"
            placeholder="Sök tickets..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="rounded-lg bg-white/10 px-3 py-2 text-sm"
          />
        </div>

        <TicketSection />
      </div>

      {/* TABLE HEADER */}

      <div className="grid grid-cols-[1fr_1fr_1fr_1fr_1fr_1fr] border-b border-white/10 px-5 py-4 text-sm text-white/70">
        <div className="font-semibold">Titel</div>
        <div className="font-semibold">Avdelning</div>
        <div className="font-semibold">Status</div>
        <div className="font-semibold">Prioritet</div>
        <div className="font-semibold">Skapad</div>
        <div className="font-semibold">Hanteras av</div>
      </div>

      {/* ROWS */}

      {visibleTickets?.map((ticket) => (
        <div key={ticket.id} className="border-t border-white/5">
          <div
            className="grid cursor-pointer grid-cols-[1fr_1fr_1fr_1fr_1fr_1fr] items-center px-5 py-4 hover:bg-white/5"
            onClick={() =>
              setSelectedTicketId(
                selectedTicketId === ticket.id ? null : ticket.id,
              )
            }
          >
            <div>{ticket.title}</div>

            <div>{ticket.department}</div>

            <div>
              <span
                className={`rounded-md px-2 py-1 text-xs ${
                  statusClasses[ticket.status]
                }`}
              >
                {ticket.status.replace("_", " ")}
              </span>
            </div>

            <div>
              <span
                className={`rounded-md px-2 py-1 text-xs ${
                  priorityClasses[ticket.priority]
                }`}
              >
                {ticket.priority}
              </span>
            </div>

            <div>{ticket.createdAt.toLocaleDateString()}</div>

            <div>
              {(() => {
                // Förutsatt att du har currentUserRole som "USER" | "HANDLER" | "ADMIN"
                if (!ticket.assignedTo) {
                  switch (currentUserRole) {
                    case "USER":
                      return <span>igen</span>;
                    case "HANDLER":
                      return (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSetStatus(ticket.id);
                          }}
                          className="rounded-lg border-2 border-blue-500 bg-blue-200/30 px-10 py-3 text-white shadow-md hover:bg-blue-500"
                        >
                          Acceptera
                        </button>
                      );
                    case "ADMIN":
                      return (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            // Här kan du t.ex. öppna en modal för att välja handläggare
                            //openAssignHandlerModal(ticket.id);
                          }}
                          className="rounded-lg border-2 border-green-500 bg-green-200/30 px-10 py-3 text-white shadow-md hover:bg-green-500"
                        >
                          Välj handläggare
                        </button>
                      );
                  }
                } else {
                  // Om ticket redan har någon assignedTo
                  return <span>{ticket.assignedTo.name}</span>;
                }
              })()}
            </div>
          </div>

          {selectedTicketId === ticket.id && (
            <div className="p-5">
              <TicketCard {...ticket} currentUserId={null} />
            </div>
          )}
        </div>
      ))}

      {!visibleTickets?.length && (
        <div className="p-10 text-center text-white/60">
          Inga tickets hittades
        </div>
      )}
    </div>
  );
}

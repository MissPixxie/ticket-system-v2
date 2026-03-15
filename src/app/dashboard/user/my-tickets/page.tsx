"use client";

import { useState } from "react";
import { api } from "~/trpc/react";
import { useSocket } from "~/app/socketProvider";
import { TicketSection } from "~/app/_components/create-ticket/ticketSection";
import TicketCard from "~/app/_components/ticketCard";

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
}

export default function MyTicketsPage({ currentUserId }: TicketTableProps) {
  const { data: tickets, isLoading } = api.ticket.listUserTickets.useQuery();

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

  const filteredTickets = tickets?.filter((ticket) => {
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

  if (isLoading) {
    return (
      <main className="flex min-h-screen items-center justify-center text-white/70">
        Laddar tickets...
      </main>
    );
  }

  const total = tickets?.length ?? 0;
  const open = tickets?.filter((t) => t.status === "OPEN").length ?? 0;
  const progress =
    tickets?.filter((t) => t.status === "IN_PROGRESS").length ?? 0;
  const closed = tickets?.filter((t) => t.status === "CLOSED").length ?? 0;

  return (
    <main className="min-h-screen px-6 py-12 text-white">
      <div className="mx-auto w-full max-w-7xl">
        {/* HEADER */}

        <h1 className="mb-8 text-2xl font-bold tracking-wide">Mina Tickets</h1>

        {/* STATS */}

        <div className="mb-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-2xl bg-white/5 p-6 shadow-lg/15 backdrop-blur-lg">
            <p className="text-sm text-white/60">Totala</p>
            <p className="mt-2 text-3xl font-bold">{total}</p>
          </div>

          <div className="rounded-2xl bg-white/5 p-6 shadow-lg/15 backdrop-blur-lg">
            <p className="text-sm text-white/60">Öppna</p>
            <p className="mt-2 text-3xl font-bold text-blue-400">{open}</p>
          </div>

          <div className="rounded-2xl bg-white/5 p-6 shadow-lg/15 backdrop-blur-lg">
            <p className="text-sm text-white/60">Pågående</p>
            <p className="mt-2 text-3xl font-bold text-amber-400">{progress}</p>
          </div>

          <div className="rounded-2xl bg-white/5 p-6 shadow-lg/15 backdrop-blur-lg">
            <p className="text-sm text-white/60">Stängda</p>
            <p className="mt-2 text-3xl font-bold text-green-400">{closed}</p>
          </div>
        </div>

        {/* TABLE CARD */}

        <div className="rounded-2xl bg-white/5 shadow-lg/15 backdrop-blur-lg">
          {/* FILTER BAR */}

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

                <div>{ticket.assignedTo?.name ?? "Ingen"}</div>
              </div>

              {selectedTicketId === ticket.id && (
                <div className="p-5">
                  <TicketCard {...ticket} currentUserId={currentUserId} />
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
      </div>
    </main>
  );
}

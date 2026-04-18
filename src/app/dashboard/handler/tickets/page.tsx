"use client";

import { api } from "~/trpc/react";
import { Status } from "@prisma/client";
import { useSocket } from "~/app/socketProvider";
import { TicketTable } from "~/app/_components/ticketTable";
import { TiTicket } from "react-icons/ti";

export default function TicketsPage() {
  const { data: tickets, isLoading } = api.ticket.listAllTickets.useQuery({
    limit: 20,
  });
  const { socket } = useSocket();
  const utils = api.useUtils();

  const updateTicket = api.ticket.updateTicket.useMutation({
    onSuccess: async (ticket) => {
      await utils.ticket.invalidate();
      if (!socket) return;
      socket.emit("join:room", ticket.id);
    },
  });

  const total = tickets?.tickets.length ?? 0;
  const newTickets =
    tickets?.tickets.filter((t) => t.status === Status.OPEN).length ?? 0;

  const inProgress =
    tickets?.tickets.filter((t) => t.status === Status.IN_PROGRESS).length ?? 0;

  const closed =
    tickets?.tickets.filter((t) => t.status === Status.CLOSED).length ?? 0;

  if (isLoading) {
    return (
      <main className="flex min-h-screen items-center justify-center text-white/70">
        Laddar tickets...
      </main>
    );
  }

  return (
    <main className="main-page-layout">
      <div className="container">
        <div className="header-container">
          <TiTicket className="text-purple-400" size={36} />
          <h1 className="page-header">Tickets översikt</h1>
        </div>
        {/* STATS CARDS */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <div className="secondary-card">
            <p className="text-sm text-white/60">Totala tickets</p>
            <p className="mt-2 text-3xl font-bold">{total}</p>
          </div>

          <div className="secondary-card">
            <p className="text-sm text-white/60">Nya tickets</p>
            <p className="mt-2 text-3xl font-bold text-blue-400">
              {newTickets}
            </p>
          </div>

          <div className="secondary-card">
            <p className="text-sm text-white/60">Pågående tickets</p>
            <p className="mt-2 text-3xl font-bold text-amber-400">
              {inProgress}
            </p>
          </div>

          <div className="secondary-card">
            <p className="text-sm text-white/60">Stängda tickets</p>
            <p className="mt-2 text-3xl font-bold text-green-400">{closed}</p>
          </div>
        </div>
        <TicketTable currentUserRole="HANDLER" />
      </div>
    </main>
  );
}

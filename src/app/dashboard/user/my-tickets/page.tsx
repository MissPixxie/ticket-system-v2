"use client";

import { api } from "~/trpc/react";
import { TicketSection } from "~/app/_components/modals/create-ticket/ticketSection";
import { TicketTable } from "~/app/_components/ticketTable";

export default function MyTicketsPage() {
  const { data: tickets, isLoading } = api.ticket.listUserTickets.useQuery();

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
    <main className="main-page-layout">
      <div className="container">
        <h1 className="page-header">Mina Tickets</h1>
        <TicketSection />
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

        <TicketTable currentUserRole="USER" />
      </div>
    </main>
  );
}

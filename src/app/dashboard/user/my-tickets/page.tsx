"use client";

import { api } from "~/trpc/react";
import { TicketSection } from "~/app/_components/modals/create-ticket/ticketSection";
import { TicketTable } from "~/app/_components/ticketTable";
import { TiTicket } from "react-icons/ti";

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
        <div className="header-container">
          <TiTicket className="text-purple-400" size={36} />
          <h1 className="page-header">Mina tickets</h1>
        </div>
        <TicketTable currentUserRole="USER" />
      </div>
    </main>
  );
}

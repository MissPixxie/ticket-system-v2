"use client";

import { api } from "~/trpc/react";
import { Status } from "@prisma/client";
import { useState } from "react";
import { TicketSection } from "~/app/_components/modals/create-ticket/ticketSection";
import TicketCard from "~/app/_components/ticketCard";
import { TicketTable } from "~/app/_components/ticketTable";

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

export default function TicketsPage() {
  const { data: tickets, isLoading } = api.ticket.listAllTickets.useQuery({
    limit: 20,
  });
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);
  const [filter, setFilter] = useState("");
  const [search, setSearch] = useState("");

  if (isLoading) {
    return (
      <main className="flex min-h-screen items-center justify-center text-white/70">
        Laddar tickets...
      </main>
    );
  }

  const total = tickets?.tickets.length ?? 0;
  const newTickets =
    tickets?.tickets.filter((t) => t.status === Status.OPEN).length ?? 0;

  const inProgress =
    tickets?.tickets.filter((t) => t.status === Status.IN_PROGRESS).length ?? 0;

  const closed =
    tickets?.tickets.filter((t) => t.status === Status.CLOSED).length ?? 0;

  const filteredTickets = tickets?.tickets.filter((ticket) => {
    switch (filter) {
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

  return (
    <main className="min-h-screen px-6 py-12 text-white">
      <div className="mx-auto w-full max-w-6xl">
        <h1 className="mb-8 text-2xl font-bold tracking-wide">
          Tickets Översikt
        </h1>

        {/* STATS CARDS */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-2xl bg-white/5 p-6 backdrop-blur-lg transition hover:bg-white/10">
            <p className="text-sm text-white/60">Totala tickets</p>
            <p className="mt-2 text-3xl font-bold">{total}</p>
          </div>

          <div className="rounded-2xl bg-white/5 p-6 backdrop-blur-lg transition hover:bg-white/10">
            <p className="text-sm text-white/60">Nya tickets</p>
            <p className="mt-2 text-3xl font-bold text-blue-400">
              {newTickets}
            </p>
          </div>

          <div className="rounded-2xl bg-white/5 p-6 backdrop-blur-lg transition hover:bg-white/10">
            <p className="text-sm text-white/60">Pågående tickets</p>
            <p className="mt-2 text-3xl font-bold text-amber-400">
              {inProgress}
            </p>
          </div>

          <div className="rounded-2xl bg-white/5 p-6 backdrop-blur-lg transition hover:bg-white/10">
            <p className="text-sm text-white/60">Stängda tickets</p>
            <p className="mt-2 text-3xl font-bold text-green-400">{closed}</p>
          </div>
        </div>

        <TicketTable currentUserId={null} currentUserRole="ADMIN" />
      </div>
    </main>
  );
}

"use client";

import { api } from "~/trpc/react";
import { Status } from "@prisma/client";

export default function TicketsPage() {
  const { data: tickets, isLoading } = api.ticket.listAllTickets.useQuery();

  if (isLoading) {
    return (
      <main className="flex min-h-screen items-center justify-center text-white/70">
        Laddar tickets...
      </main>
    );
  }

  const total = tickets?.length ?? 0;
  const newTickets =
    tickets?.filter((t) => t.status === Status.OPEN).length ?? 0;

  const inProgress =
    tickets?.filter((t) => t.status === Status.IN_PROGRESS).length ?? 0;

  const closed = tickets?.filter((t) => t.status === Status.CLOSED).length ?? 0;
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
      </div>
    </main>
  );
}

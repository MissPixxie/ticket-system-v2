"use client";

import { api } from "~/trpc/react";
import ChatBox from "~/app/_components/chatBox";
import { getCurrentUserId } from "~/app/_components/getCurrentUserId";
import { useState, useEffect } from "react";

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

export default function TicketPage({
  params,
}: {
  params: { ticketId: string };
}) {
  const { ticketId } = params;
  const { data: ticket, isLoading } = api.ticket.getTicketById.useQuery({
    id: ticketId,
  });

  if (isLoading || !ticket) {
    return (
      <main className="flex min-h-screen items-center justify-center text-white/70">
        Laddar ticket...
      </main>
    );
  }

  return (
    <main className="min-h-screen px-6 py-12 text-white">
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="rounded-2xl bg-white/5 p-6 backdrop-blur-lg">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-2xl font-bold">{ticket.title}</h1>
              <p className="text-sm text-white/60">{ticket.department}</p>
            </div>

            <div className="flex gap-2">
              <span
                className={`rounded-full px-3 py-1 text-xs font-semibold ${
                  statusClasses[ticket.status]
                }`}
              >
                {ticket.status}
              </span>

              <span
                className={`rounded-full px-3 py-1 text-xs font-semibold ${
                  priorityClasses[ticket.priority]
                }`}
              >
                {ticket.priority}
              </span>
            </div>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-2">
            <div className="rounded-2xl bg-white/5 p-6 backdrop-blur-lg">
              <h2 className="mb-3 text-lg font-semibold">Beskrivning</h2>
              <p className="text-white/80">{ticket.issue}</p>
            </div>

            <div className="rounded-2xl bg-white/5 p-6 backdrop-blur-lg">
              <h2 className="mb-4 text-lg font-semibold">Information</h2>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <p className="text-sm text-white/60">Skapad av</p>
                  <p>{ticket.createdBy?.name}</p>
                </div>

                <div>
                  <p className="text-sm text-white/60">Tilldelad</p>
                  <p>{ticket.assignedTo?.name ?? "Ingen"}</p>
                </div>

                <div>
                  <p className="text-sm text-white/60">Skapad</p>
                  <p>{new Date(ticket.createdAt).toLocaleString()}</p>
                </div>

                <div>
                  <p className="text-sm text-white/60">Status</p>
                  <p>{ticket.status}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-2xl bg-white/5 p-6 backdrop-blur-lg">
            <ChatBox ticketId={ticket.id} currentUserId={currentUserId} />
          </div>
        </div>
      </div>
    </main>
  );
}

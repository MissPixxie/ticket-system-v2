"use client";

import { api } from "~/trpc/react";
import { FaUsers, FaTicketAlt, FaPlus } from "react-icons/fa";
import { UserSection } from "~/app/_components/modals/create-user/userSection";
import Link from "next/link";

export default function AdminHome() {
  const { data: users } = api.user.listAll.useQuery({ limit: 20 });
  const { data: tickets } = api.ticket.listAllTickets.useQuery({ limit: 20 });

  return (
    <main className="min-h-screen px-6 py-12 text-white">
      <div className="mx-auto max-w-7xl space-y-10">
        {/* HEADER */}
        <div>
          <h1 className="text-3xl font-bold tracking-wide">Admin Dashboard</h1>
          <p className="text-white/60">Översikt över systemet</p>
        </div>

        {/* STATS */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-2xl bg-white/5 p-6 backdrop-blur-lg">
            <div className="flex items-center justify-between">
              <FaUsers className="text-blue-400" />
              <span className="text-3xl font-bold">
                {users?.users.length ?? 0}
              </span>
            </div>
            <p className="mt-2 text-white/60">Användare</p>
          </div>

          <div className="rounded-2xl bg-white/5 p-6 backdrop-blur-lg">
            <div className="flex items-center justify-between">
              <FaTicketAlt className="text-amber-400" />
              <span className="text-3xl font-bold">
                {tickets?.tickets.length ?? 0}
              </span>
            </div>
            <p className="mt-2 text-white/60">Tickets</p>
          </div>
        </div>

        {/* QUICK ACTIONS */}
        <div className="rounded-2xl bg-white/5 p-8 backdrop-blur-lg">
          <h2 className="mb-6 text-xl font-semibold">Snabbåtgärder</h2>

          <div className="flex flex-wrap gap-4">
            <UserSection />

            <Link
              href={"/dashboard/admin/tickets"}
              className="cursor-pointer rounded-xl bg-white/10 px-5 py-3 font-medium transition hover:bg-white/20"
            >
              Se alla tickets
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}

"use client";

import { useState } from "react";
import { api } from "~/trpc/react";
import { FaUser, FaTicketAlt, FaExclamationTriangle } from "react-icons/fa";

const severityColor = {
  INFO: "text-blue-400",
  WARNING: "text-yellow-400",
  ERROR: "text-red-400",
};

export default function LogsPage() {
  const [search, setSearch] = useState("");
  const [type, setType] = useState("ALL");

  const { data: logs } = api.auditLog.list.useQuery({
    search,
    type,
  });

  return (
    <main className="min-h-screen px-8 py-10 text-white">
      <div className="mx-auto max-w-7xl space-y-8">
        {/* HEADER */}
        <div>
          <h1 className="text-3xl font-bold tracking-wide">Systemloggar</h1>
          <p className="text-white/60">Audit trail & systemaktivitet</p>
        </div>

        {/* STATS CARDS */}
        <div className="grid gap-6 md:grid-cols-3">
          <div className="rounded-2xl bg-white/5 p-6 backdrop-blur-lg">
            <FaUser className="mb-2 text-blue-400" />
            <p className="text-2xl font-bold">
              {logs?.filter((l) => l.type.includes("USER")).length ?? 0}
            </p>
            <p className="text-white/60">Användarhändelser</p>
          </div>

          <div className="rounded-2xl bg-white/5 p-6 backdrop-blur-lg">
            <FaTicketAlt className="mb-2 text-amber-400" />
            <p className="text-2xl font-bold">
              {logs?.filter((l) => l.type.includes("TICKET")).length ?? 0}
            </p>
            <p className="text-white/60">Ticket-händelser</p>
          </div>

          <div className="rounded-2xl bg-white/5 p-6 backdrop-blur-lg">
            <FaExclamationTriangle className="mb-2 text-red-400" />
            <p className="text-2xl font-bold">
              {logs?.filter((l) => l.severity === "ERROR").length ?? 0}
            </p>
            <p className="text-white/60">Fel</p>
          </div>
        </div>

        {/* FILTER BAR */}
        <div className="flex flex-col gap-4 rounded-2xl bg-white/5 p-6 backdrop-blur-lg md:flex-row md:items-center md:justify-between">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Sök i loggar..."
            className="w-full rounded-xl bg-white/10 px-4 py-2 text-white placeholder:text-white/40 focus:outline-none md:max-w-sm"
          />

          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="rounded-xl bg-white/10 px-4 py-2 text-white focus:outline-none"
          >
            <option value="ALL">Alla</option>
            <option value="USER">Användare</option>
            <option value="TICKET">Tickets</option>
            <option value="AUTH">Auth</option>
            <option value="ERROR">Fel</option>
          </select>
        </div>

        {/* LOG TABLE */}
        <div className="overflow-hidden rounded-2xl bg-white/5 backdrop-blur-lg">
          <table className="w-full text-left">
            <thead className="border-b border-white/10 text-sm text-white/60">
              <tr>
                <th className="px-6 py-4">Tid</th>
                <th className="px-6 py-4">Användare</th>
                <th className="px-6 py-4">Typ</th>
                <th className="px-6 py-4">Beskrivning</th>
              </tr>
            </thead>

            <tbody>
              {logs?.map((log) => (
                <tr
                  key={log.id}
                  className="border-b border-white/5 transition hover:bg-white/5"
                >
                  <td className="px-6 py-4 text-white/60">
                    {new Date(log.createdAt).toLocaleString()}
                  </td>

                  <td className="px-6 py-4">{log.actor?.name ?? "System"}</td>

                  <td className="px-6 py-4">
                    <span className="rounded-full bg-blue-500/20 px-3 py-1 text-xs text-blue-300">
                      {log.type}
                    </span>
                  </td>

                  <td className="px-6 py-4 text-white/80">{log.message}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}

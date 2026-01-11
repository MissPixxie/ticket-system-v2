"use client";

import { api } from "~/trpc/react";
import { RiEdit2Fill } from "react-icons/ri";
import { FaTrashAlt } from "react-icons/fa";

export function ListAllTickets() {
  const { data: tickets, isLoading } = api.ticket.listAllTickets.useQuery();

  if (isLoading) return <p>Laddar tickets...</p>;
  if (!tickets || tickets.length === 0) return <p>Inga tickets hittades</p>;

  return (
    <table className="min-w-full border border-gray-300/50">
      <thead className="bg-white/10">
        <tr>
          <th className="border border-gray-300/50 px-4 py-2">Namn</th>
          <th className="border border-gray-300/50 px-4 py-2">Email</th>
          <th className="border border-gray-300/50 px-4 py-2">Status</th>
          <th className="border border-gray-300/50 px-4 py-2">Priority</th>
          <th className="border border-gray-300/50 px-4 py-2"></th>
        </tr>
      </thead>
      <tbody>
        {tickets.map((ticket) => (
          <tr key={ticket.id} className="hover:bg-gray-50/20">
            <td className="border border-gray-300/50 px-4 py-2">
              {ticket.title}
            </td>
            <td className="border border-gray-300/50 px-4 py-2">
              {ticket.department}
            </td>
            <td className="border border-gray-300/50 px-4 py-2">
              {ticket.status}
            </td>
            <td className="border border-gray-300/50 px-4 py-2">
              {ticket.priority}
            </td>
            <td className="flex flex-row justify-center gap-x-5 gap-y-5">
              <div className="rounded bg-green-600 p-1">
                <RiEdit2Fill size={26} />
              </div>
              <div className="rounded bg-red-600 p-2">
                <FaTrashAlt size={26} />
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

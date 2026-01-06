"use client";

import { api } from "~/trpc/react";
import { RiEdit2Fill } from "react-icons/ri";
import { FaTrashAlt } from "react-icons/fa";

export function ListAllUsers() {
  const { data: users, isLoading } = api.user.listAll.useQuery();

  if (isLoading) return <p>Laddar användare...</p>;
  if (!users || users.length === 0) return <p>Inga användare hittades</p>;

  return (
    <table className="min-w-full border border-gray-300/50">
      <thead className="bg-white/10">
        <tr>
          <th className="border border-gray-300/50 px-4 py-2">Namn</th>
          <th className="border border-gray-300/50 px-4 py-2">Email</th>
          <th className="border border-gray-300/50 px-4 py-2">Roll</th>
          <th className="border border-gray-300/50 px-4 py-2"></th>
        </tr>
      </thead>
      <tbody>
        {users.map((user) => (
          <tr key={user.id} className="hover:bg-gray-50/20">
            <td className="border border-gray-300/50 px-4 py-2">{user.name}</td>
            <td className="border border-gray-300/50 px-4 py-2">
              {user.email}
            </td>
            <td className="border border-gray-300/50 px-4 py-2">
              {user.role?.name || "Ingen roll"}
            </td>
            <td className="flex flex-row justify-end gap-5 border border-gray-300/50 px-4 py-2">
              <div className="rounded-md bg-green-500 p-2">
                {/* Skapa funktion för att redigera  */}
                <RiEdit2Fill size={20} />
              </div>
              <div className="rounded-md bg-red-600 p-2">
                {/* Skapa funktion för att radera  */}
                <FaTrashAlt size={20} />
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

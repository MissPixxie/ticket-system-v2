"use client";

import React, { useState } from "react";
import { api } from "~/trpc/react";

export interface InviteUserData {
  userId: string;
  ticketId: string;
}

interface InviteUserModalProps {
  ticketId: string;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: InviteUserData) => void;
}

const InviteUserModal: React.FC<InviteUserModalProps> = ({
  ticketId,
  isOpen,
  onClose,
  onSubmit,
}) => {
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<null | string>(null);
  const { data: users, isLoading } = api.user.searchUser.useQuery(
    { query: search },
    {
      enabled: search.length >= 1,
    },
  );

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      userId: selected!,
      ticketId,
    });
    setSearch("");
    setSelected(null);
  };

  const visibleUsers = users?.filter((user) => {
    const searchLower = search.toLowerCase();
    return (
      user.name?.toLowerCase().includes(searchLower) ||
      user.email?.toLowerCase().includes(searchLower) ||
      user.role?.name.toLowerCase().includes(searchLower)
    );
  });

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center dark:bg-black/60"
      onClick={onClose}
    >
      <div
        className="w-full max-w-xl rounded-lg bg-linear-to-b p-6 shadow-lg dark:from-[#3b0e7a] dark:to-[#282a53]"
        onClick={(e) => e.stopPropagation()}
      >
        <form onSubmit={handleSubmit} className="mt-5 flex flex-col gap-2">
          <label htmlFor="title">Sök användare</label>
          <input
            type="text"
            placeholder="Sök användare..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="rounded bg-gray-700 px-3 py-2 text-white shadow-md/20"
          />
          <div className="mt-3 flex flex-col gap-2">
            {visibleUsers?.map((user) => (
              <button
                key={user.id}
                type="button"
                onClick={() => setSelected(user.id)}
                className={`rounded px-3 py-2 text-left ${
                  selected === user.id
                    ? "bg-blue-500 text-white"
                    : "bg-gray-700"
                }`}
              >
                {user.name} ({user.email})
              </button>
            ))}
          </div>
          <div className="flex justify-end space-x-2 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="rounded border px-4 py-2"
            >
              Avbryt
            </button>
            <button
              type="submit"
              className="rounded-full bg-blue-500 px-10 py-3 text-white"
            >
              Bjud in
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default InviteUserModal;

"use client";

import { useEffect, useState } from "react";
import { api } from "~/trpc/react";

interface UserTableProps {
  onSelectUsers?: (users: string[]) => void;
}

export function UserTable({ onSelectUsers }: UserTableProps) {
  const { data, isLoading } = api.user.listAll.useQuery({
    limit: 50,
  });

  const [search, setSearch] = useState("");
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

  const [selectMode, setSelectMode] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);

  useEffect(() => {
    onSelectUsers?.(selectedUsers);
  }, [selectedUsers, onSelectUsers]);

  if (isLoading) return <p>Laddar användare...</p>;
  if (!data || data.users.length === 0) return <p>Inga användare hittades</p>;

  const visibleUsers = data.users.filter((user) => {
    const searchLower = search.toLowerCase();

    return (
      user.name?.toLowerCase().includes(searchLower) ||
      user.email?.toLowerCase().includes(searchLower) ||
      user.role?.name.toLowerCase().includes(searchLower)
    );
  });

  const toggleUser = (userId: string) => {
    setSelectedUsers((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId],
    );
  };

  return (
    <div className="rounded-2xl bg-white/5 shadow-lg/15 backdrop-blur-lg">
      {/* HEADER */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 p-5">
        <div className="flex items-center gap-4">
          <input
            type="text"
            placeholder="Sök användare..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="rounded-lg bg-white/10 px-3 py-2 text-sm text-white placeholder:text-white/40"
          />

          <button
            onClick={() => {
              setSelectMode((prev) => !prev);
              setSelectedUsers([]);
            }}
            className="rounded-lg cursor-pointer bg-white/10 px-3 py-2 text-sm text-white hover:bg-white/20"
          >
            {selectMode ? "Avbryt val" : "Välj flera"}
          </button>

          {selectMode && (
            <span className="text-sm text-white/60">
              {selectedUsers.length} valda
            </span>
          )}
        </div>
      </div>

      <div
        className={`grid border-b border-white/10 px-5 py-4 text-sm text-white/70 ${
          selectMode
            ? "grid-cols-[40px_1fr_1fr_1fr_1fr]"
            : "grid-cols-[1fr_1fr_1fr_1fr]"
        }`}
      >
        {selectMode && <div />}
        <div className="font-semibold">Namn</div>
        <div className="font-semibold">Email</div>
        <div className="font-semibold">Roll</div>
        <div className="font-semibold">Skapad</div>
      </div>

      {visibleUsers.map((user) => {
        const isSelected = selectedUsers.includes(user.id);

        return (
          <div key={user.id} className="border-t border-white/5">
            <div
              className={`grid items-center px-5 py-4 transition ${
                selectMode
                  ? "grid-cols-[40px_1fr_1fr_1fr_1fr]"
                  : "grid-cols-[1fr_1fr_1fr_1fr]"
              } ${
                isSelected
                  ? "bg-blue-500/20"
                  : "cursor-pointer hover:bg-white/5"
              }`}
              onClick={() => {
                if (selectMode) {
                  toggleUser(user.id);
                } else {
                  setSelectedUserId(
                    selectedUserId === user.id ? null : user.id,
                  );
                }
              }}
            >
              {selectMode && (
                <div className="flex justify-center">
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => toggleUser(user.id)}
                    onClick={(e) => e.stopPropagation()}
                    className="h-4 w-4 cursor-pointer accent-blue-500"
                  />
                </div>
              )}

              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20 text-sm">
                  {user.name?.[0] ?? "?"}
                </div>
                {user.name ?? "—"}
              </div>
              <div className="text-white/70">{user.email}</div>

              <div>
                <span className="rounded-md bg-blue-500/20 px-2 py-1 text-xs text-white">
                  {user.role?.name ?? "Ingen roll"}
                </span>
              </div>
              <div>{user.createdAt.toLocaleDateString()}</div>
            </div>
            {!selectMode && selectedUserId === user.id && (
              <div className="p-5 text-sm text-white/70">
                <p>
                  <strong>ID:</strong> {user.id}
                </p>
                <p>
                  <strong>Email:</strong> {user.email}
                </p>
                <p>
                  <strong>Roll:</strong> {user.role?.name}
                </p>
              </div>
            )}
          </div>
        );
      })}

      {!visibleUsers.length && (
        <div className="p-10 text-center text-white/60">
          Inga användare matchar din sökning
        </div>
      )}
    </div>
  );
}

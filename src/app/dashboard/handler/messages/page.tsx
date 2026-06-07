"use client";

import { useMemo, useState } from "react";
import { api } from "~/trpc/react";
import { MessagesTable } from "~/app/_components/messagesTable";
import { LuMessageSquareText, LuSearch, LuUsers } from "react-icons/lu";

import { Department } from "@prisma/client";

import {
  FaLaptop,
  FaUsers,
  FaShopify,
  FaShoppingCart,
  FaHandHoldingHeart,
} from "react-icons/fa";

const departments = [
  { value: Department.IT, label: "IT", icon: <FaLaptop size={18} /> },
  { value: Department.HR, label: "HR", icon: <FaUsers size={18} /> },
  {
    value: Department.CAMPAIGN,
    label: "Kampanj",
    icon: <FaShopify size={18} />,
  },
  {
    value: Department.PRODUCT,
    label: "Produkt",
    icon: <FaShoppingCart size={18} />,
  },
  {
    value: Department.CUSTOMERCLUB,
    label: "Kundklubb",
    icon: <FaHandHoldingHeart size={18} />,
  },
];

type SelectedUser = {
  id: string;
  name: string | null;
  departments: {
    department: Department;
  }[];
};

export default function MessagePage() {
  const utils = api.useUtils();

  const [newMessage, setNewMessage] = useState("");

  const [selectedDepartments, setSelectedDepartments] = useState<Department[]>(
    [],
  );

  const [search, setSearch] = useState("");

  const [selectedUsers, setSelectedUsers] = useState<SelectedUser[]>([]);

  /**
   * USERS
   */
  const { data: users, isLoading: usersLoading } =
    api.message.getUsersToMessage.useQuery();

  /**
   * FILTER USERS
   */
  const filteredUsers = useMemo(() => {
    if (!users) return [];

    return users.filter((user) =>
      user.name?.toLowerCase().includes(search.toLowerCase()),
    );
  }, [users, search]);

  /**
   * TOGGLE DEPARTMENT
   */
  function handleDepartmentChange(dep: Department) {
    setSelectedDepartments((prev) =>
      prev.includes(dep) ? prev.filter((d) => d !== dep) : [...prev, dep],
    );
  }

  /**
   * TOGGLE USER
   */
  function toggleUser(user: SelectedUser) {
    setSelectedUsers((prev) => {
      const exists = prev.some((u) => u.id === user.id);

      if (exists) {
        return prev.filter((u) => u.id !== user.id);
      }

      return [...prev, user];
    });
  }

  /**
   * CREATE MESSAGE
   */
  const createMessage = api.message.createThread.useMutation({
    onSuccess: async () => {
      await utils.message.listUserMessages.invalidate();

      setNewMessage("");
      setSelectedDepartments([]);
      setSelectedUsers([]);
      setSearch("");
    },
  });

  /**
   * SEND
   */
  const handleSend = () => {
    if (!newMessage.trim()) return;

    createMessage.mutate({
      type: "GENERAL",
      message: newMessage,
      receiverDepartments: selectedDepartments,
      receivers: selectedUsers.map((u) => u.id),
    });
  };

  return (
    <main className="main-page-layout">
      <div className="mx-auto w-full">
        {/* HEADER */}
        <div className="header-container mb-8">
          <LuMessageSquareText className="text-purple-400" size={36} />

          <div>
            <h1 className="page-header">Meddelande</h1>

            <p className="mt-1 text-sm text-white/50">
              Skicka meddelanden till avdelningar eller specifika användare
            </p>
          </div>
        </div>

        {/* MAIN GRID */}
        <div className="grid gap-8 xl:grid-cols-[1fr_0.9fr]">
          {/* LEFT SIDE */}
          <div className="rounded-2xl bg-white/5 p-8 shadow-2xl backdrop-blur-xl">
            <div className="space-y-8">
              {/* MESSAGE */}
              <div className="space-y-3">
                <div>
                  <h2 className="text-lg font-semibold text-white">
                    Nytt meddelande
                  </h2>

                  <p className="mt-1 text-sm text-white/40">
                    Skriv ditt meddelande till mottagarna
                  </p>
                </div>

                <textarea
                  placeholder="Skriv ditt meddelande här..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  rows={6}
                  className="w-full resize-none rounded-2xl border border-white/10 bg-white/5 px-4 py-4 text-white transition-all outline-none placeholder:text-white/40 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                />
              </div>

              {/* DEPARTMENTS */}
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-white">
                    Avdelningar
                  </h3>

                  <p className="mt-1 text-sm text-white/40">
                    Välj vilka avdelningar som ska få meddelandet
                  </p>
                </div>

                <div className="flex flex-wrap gap-3">
                  {departments.map((dep) => {
                    const isSelected = selectedDepartments.includes(dep.value);

                    return (
                      <button
                        key={dep.value}
                        type="button"
                        onClick={() => handleDepartmentChange(dep.value)}
                        className={`flex items-center gap-3 rounded-2xl border px-5 py-3 transition-all duration-200 ${
                          isSelected
                            ? "border-blue-500 bg-blue-500/20 text-blue-300 shadow-lg shadow-blue-500/10"
                            : "border-white/10 bg-white/5 text-white hover:bg-white/10"
                        } `}
                      >
                        <div
                          className={`transition-transform ${
                            isSelected ? "scale-110" : ""
                          }`}
                        >
                          {dep.icon}
                        </div>

                        <span className="font-medium">{dep.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* USERS */}
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-white">
                    Specifika användare
                  </h3>

                  <p className="mt-1 text-sm text-white/40">
                    Sök och välj individuella mottagare
                  </p>
                </div>

                {/* SEARCH */}
                <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 transition-all focus-within:border-blue-500 focus-within:ring-4 focus-within:ring-blue-500/10">
                  <LuSearch className="shrink-0 text-white/40" size={18} />

                  <input
                    type="text"
                    placeholder="Sök användare..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full bg-transparent text-white outline-none placeholder:text-white/40"
                  />
                </div>

                {/* SELECTED USERS */}
                {selectedUsers.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {selectedUsers.map((user) => (
                      <div
                        key={user.id}
                        className="flex items-center gap-2 rounded-full bg-blue-500/20 px-3 py-1.5 text-sm text-blue-200"
                      >
                        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-linear-to-br from-blue-500 to-purple-500 text-xs font-semibold text-white">
                          {user.name?.charAt(0) ?? "U"}
                        </div>

                        <span>{user.name}</span>

                        <button
                          type="button"
                          onClick={() =>
                            setSelectedUsers((prev) =>
                              prev.filter((u) => u.id !== user.id),
                            )
                          }
                          className="text-blue-300 transition-colors hover:text-white"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {/* USERS LIST */}
                <div className="space-y-2">
                  {usersLoading && (
                    <div className="space-y-2">
                      {Array.from({ length: 4 }).map((_, i) => (
                        <div
                          key={i}
                          className="h-20 animate-pulse rounded-2xl border border-white/10 bg-white/5"
                        />
                      ))}
                    </div>
                  )}

                  {!usersLoading &&
                    filteredUsers.map((user) => {
                      const isSelected = selectedUsers.some(
                        (u) => u.id === user.id,
                      );

                      return (
                        <button
                          key={user.id}
                          type="button"
                          onClick={() =>
                            toggleUser({
                              id: user.id,
                              name: user.name,
                              departments: user.departments,
                            })
                          }
                          className={`flex w-full items-center justify-between rounded-2xl border px-4 py-2 text-left transition-all duration-200 ${
                            isSelected
                              ? "border-blue-500 bg-blue-500/10"
                              : "border-white/10 bg-white/5 hover:bg-white/10"
                          } `}
                        >
                          <div className="flex items-center gap-4">
                            {/* Avatar */}
                            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-linear-to-br from-blue-500 to-purple-500 font-semibold text-white">
                              {user.name?.charAt(0) ?? "U"}
                            </div>

                            {/* INFO */}
                            <div>
                              <p className="text-sm font-medium text-white">
                                {user.name}
                              </p>

                              <div className="mt-1 flex items-center gap-2 text-sm text-white/50">
                                <LuUsers size={14} />

                                <div className="mt-1 flex flex-wrap gap-1">
                                  {user.departments.map((dep) => (
                                    <div
                                      key={dep.department}
                                      className="rounded-full bg-white/10 px-2 py-0.5 text-xs text-white/60"
                                    >
                                      {dep.department}
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* BUTTON */}
                          <div
                            className={`rounded-full px-3 py-1 text-sm font-medium transition-all ${
                              isSelected
                                ? "bg-blue-500 text-white"
                                : "bg-white/10 text-white/60"
                            } `}
                          >
                            {isSelected ? "Vald" : "Välj"}
                          </div>
                        </button>
                      );
                    })}
                </div>
              </div>

              {/* FOOTER */}
              <div className="flex flex-col gap-4 border-t border-white/10 pt-6 sm:flex-row sm:items-center sm:justify-between">
                <div className="text-sm text-white/40">
                  {selectedDepartments.length} avdelningar •{" "}
                  {selectedUsers.length} användare valda
                </div>

                <button
                  onClick={handleSend}
                  disabled={createMessage.isPending}
                  className="rounded-2xl bg-blue-600 px-6 py-3 font-medium text-white transition-all hover:scale-[1.02] hover:bg-blue-500 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {createMessage.isPending ? "Skickar..." : "Skicka meddelande"}
                </button>
              </div>
            </div>
          </div>

          {/* RIGHT SIDE */}
          <div className="space-y-6">
            {/* MESSAGES */}
            <MessagesTable />
          </div>
        </div>
      </div>
    </main>
  );
}

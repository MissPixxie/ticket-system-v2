"use client";

import { useMemo, useState } from "react";
import { api } from "~/trpc/react";
import { MessagesTable } from "~/app/_components/messagesTable";
import { LuMessageSquareText, LuSearch } from "react-icons/lu";
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

/**
 * MOCK USERS
 * Byt ut mot riktig tRPC-query senare
 */
const mockUsers = [
  {
    id: "1",
    name: "Anton Andersson",
    department: "IT",
  },
  {
    id: "2",
    name: "Lisa Karlsson",
    department: "HR",
  },
  {
    id: "3",
    name: "Erik Svensson",
    department: "Produkt",
  },
  {
    id: "4",
    name: "Emma Nilsson",
    department: "Kampanj",
  },
  {
    id: "5",
    name: "Oscar Larsson",
    department: "Kundklubb",
  },
];

type SelectedUser = {
  id: string;
  name: string;
  department: string;
};

export default function MessagePage() {
  const utils = api.useUtils();

  const [newMessage, setNewMessage] = useState("");

  const [selectedDepartments, setSelectedDepartments] = useState<Department[]>(
    [],
  );

  const [search, setSearch] = useState("");

  const [selectedUsers, setSelectedUsers] = useState<SelectedUser[]>([]);

  function handleDepartmentChange(dep: Department) {
    setSelectedDepartments((prev) =>
      prev.includes(dep) ? prev.filter((d) => d !== dep) : [...prev, dep],
    );
  }

  function toggleUser(user: SelectedUser) {
    setSelectedUsers((prev) => {
      const exists = prev.some((u) => u.id === user.id);

      if (exists) {
        return prev.filter((u) => u.id !== user.id);
      }

      return [...prev, user];
    });
  }

  const filteredUsers = useMemo(() => {
    return mockUsers.filter((user) =>
      user.name.toLowerCase().includes(search.toLowerCase()),
    );
  }, [search]);

  const createMessage = api.message.createThread.useMutation({
    onSuccess: () => {
      utils.message.listUserMessages.invalidate();

      setNewMessage("");
      setSelectedDepartments([]);
      setSelectedUsers([]);
      setSearch("");
    },
  });

  const handleSend = () => {
    if (!newMessage.trim()) return;

    createMessage.mutate({
      type: "GENERAL",
      message: newMessage,
      receiverDepartments: selectedDepartments,

      // Lägg till detta i backend senare
      // receiverUserIds: selectedUsers.map((u) => u.id),
    });
  };

  return (
    <main className="main-page-layout">
      <div className="container">
        {/* Header */}
        <div className="header-container">
          <LuMessageSquareText className="text-purple-400" size={36} />

          <h1 className="page-header">Meddelande</h1>
        </div>

        {/* Card */}
        <div className="rounded-3xl bg-white/5 p-8 shadow-2xl backdrop-blur-xl">
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-white">
              Nytt meddelande
            </h2>

            <p className="mt-1 text-sm text-white/50">
              Skicka till avdelningar eller specifika användare
            </p>
          </div>

          <div className="space-y-8">
            {/* MESSAGE */}
            <div className="space-y-3">
              <label className="text-sm font-medium text-white/70">
                Meddelande
              </label>

              <textarea
                placeholder="Skriv ditt meddelande..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                rows={5}
                className="w-full resize-none rounded-2xl border border-white/10 bg-white/5 px-4 py-4 text-white transition-all outline-none placeholder:text-white/40 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
              />
            </div>

            {/* DEPARTMENTS */}
            <div className="space-y-4">
              <div>
                <h3 className="text-md font-medium text-white/70">
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
                      className={`group flex items-center gap-3 rounded-2xl border px-5 py-3 transition-all duration-200 ${
                        isSelected
                          ? "border-blue-500 bg-blue-500/20 text-blue-300 shadow-lg shadow-blue-500/10"
                          : "border-white/10 bg-white/5 text-white hover:bg-white/10"
                      } `}
                    >
                      <div
                        className={`transition-transform duration-200 ${isSelected ? "scale-110" : ""} `}
                      >
                        {dep.icon}
                      </div>

                      <span className="text-sm font-medium">{dep.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* USER SEARCH */}
            <div className="space-y-4">
              <div>
                <h3 className="text-md font-medium text-white/70">
                  Specifika användare
                </h3>

                <p className="mt-1 text-sm text-white/40">
                  Sök och välj enskilda mottagare
                </p>
              </div>

              {/* Search Input */}
              <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 transition-all focus-within:border-blue-500 focus-within:ring-4 focus-within:ring-blue-500/10">
                <LuSearch className="text-white/40" size={18} />

                <input
                  type="text"
                  placeholder="Sök användare..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full bg-transparent text-white outline-none placeholder:text-white/40"
                />
              </div>

              {/* Selected Users */}
              {selectedUsers.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {selectedUsers.map((user) => (
                    <div
                      key={user.id}
                      className="flex items-center gap-2 rounded-full bg-blue-500/20 px-3 py-1.5 text-sm text-blue-200"
                    >
                      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-linear-to-br from-blue-500 to-purple-500 text-xs font-semibold text-white">
                        {user.name.charAt(0)}
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

              {/* User List */}
              <div className="space-y-2">
                {filteredUsers.map((user) => {
                  const isSelected = selectedUsers.some(
                    (u) => u.id === user.id,
                  );

                  return (
                    <button
                      key={user.id}
                      type="button"
                      onClick={() => toggleUser(user)}
                      className={`flex w-full items-center justify-between rounded-2xl border px-4 py-3 text-left transition-all duration-200 ${
                        isSelected
                          ? "border-blue-500 bg-blue-500/10"
                          : "border-white/10 bg-white/5 hover:bg-white/10"
                      } `}
                    >
                      <div className="flex items-center gap-4">
                        {/* Avatar */}
                        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-linear-to-br from-blue-500 to-purple-500 font-semibold text-white">
                          {user.name.charAt(0)}
                        </div>

                        {/* User Info */}
                        <div>
                          <p className="font-medium text-white">{user.name}</p>

                          <p className="text-sm text-white/50">
                            {user.department}
                          </p>
                        </div>
                      </div>

                      {/* Select Button */}
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

            {/* Footer */}
            <div className="flex items-center justify-between border-t border-white/10 pt-6">
              <div className="text-sm text-white/40">
                {selectedDepartments.length} avdelningar •{" "}
                {selectedUsers.length} användare valda
              </div>

              <button
                onClick={handleSend}
                className="rounded-2xl bg-blue-600 px-6 py-3 font-medium text-white transition-all hover:scale-[1.02] hover:bg-blue-500 active:scale-[0.98]"
              >
                Skicka meddelande
              </button>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div>
          <MessagesTable />
        </div>
      </div>
    </main>
  );
}

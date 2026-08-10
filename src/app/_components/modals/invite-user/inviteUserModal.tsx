"use client";

import React, { useMemo, useState } from "react";
import ReactDOM from "react-dom";
import {
  FaUsers,
  FaUser,
  FaUserTie,
  FaLaptop,
  FaPeopleGroup,
} from "react-icons/fa6";
import { api } from "~/trpc/react";
import FeedbackBubble from "../../feedbackBubble";

export interface InviteUserData {
  userId: string;
  conversationId: string;
}

interface InviteUserModalProps {
  conversationId: string;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: InviteUserData) => void;
}

const departments = [
  {
    value: "ALL",
    label: "Alla",
  },
  {
    value: "IT",
    label: "IT",
  },
  {
    value: "HR",
    label: "HR",
  },
  {
    value: "CAMPAIGN",
    label: "Kampanj",
  },
  {
    value: "PRODUCT",
    label: "Produkt",
  },
  {
    value: "CUSTOMERCLUB",
    label: "Kundklubb",
  },
];

const roles = [
  {
    value: "ALL",
    label: "Alla",
  },
  {
    value: "USER",
    label: "Användare",
  },
  {
    value: "HANDLER",
    label: "Handläggare",
  },
];

const departmentLabels: Record<string, string> = {
  IT: "IT",
  HR: "HR",
  CAMPAIGN: "Kampanj",
  PRODUCT: "Produkt",
  CUSTOMERCLUB: "Kundklubb",
};

function getInitial(name?: string | null) {
  return name?.charAt(0).toUpperCase() ?? "?";
}

const InviteUserModal: React.FC<InviteUserModalProps> = ({
  conversationId,
  isOpen,
  onClose,
  onSubmit,
}) => {
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<string | null>(null);
  const [roleFilter, setRoleFilter] = useState("ALL");
  const [departmentFilter, setDepartmentFilter] = useState("ALL");
  const [notify, setNotify] = useState(false);

  /*
   * Viktigt:
   * Queryn körs även när search är tom.
   * Då får vi en lista direkt när modalen öppnas.
   *
   * Om du redan har en listAll-query för användare
   * kan vi använda den istället.
   */
  const { data: userData, isLoading } = api.user.listAll.useQuery({
    limit: 50,
  });

  const users = userData?.users ?? [];

  const visibleUsers = useMemo(() => {
    const searchLower = search.toLowerCase().trim();

    return users.filter((user) => {
      const matchesSearch =
        !searchLower ||
        user.name?.toLowerCase().includes(searchLower) ||
        user.email?.toLowerCase().includes(searchLower) ||
        user.role?.name?.toLowerCase().includes(searchLower);

      const matchesRole =
        roleFilter === "ALL" || user.role?.name === roleFilter;

      /*
       * Detta kräver att API:t returnerar departments.
       */
      const matchesDepartment =
        departmentFilter === "ALL" ||
        user.departments?.some(
          (department) => department.department === departmentFilter,
        );

      return matchesSearch && matchesRole && matchesDepartment;
    });
  }, [users, search, roleFilter, departmentFilter]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!selected) return;

    onSubmit({
      userId: selected,
      conversationId,
    });

    setSearch("");
    setSelected(null);
    setRoleFilter("ALL");
    setDepartmentFilter("ALL");
    setNotify(true);
  };

  const selectedUser = users.find((user) => user.id === selected);

  return ReactDOM.createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="w-full max-w-xl overflow-hidden rounded-2xl border border-white/10 bg-linear-to-b from-[#3b0e7a] to-[#282a53] shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* HEADER */}

        <div className="border-b border-white/10 px-6 py-5">
          <h2 className="text-lg font-semibold text-white">
            Bjud in användare
          </h2>

          <p className="mt-1 text-sm text-white/40">
            Välj vem som ska läggas till i konversationen
          </p>
        </div>

        <div className="p-6">
          {/* SEARCH */}

          <div className="relative">
            <input
              type="text"
              placeholder="Sök användare..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white transition-all outline-none placeholder:text-white/35 focus:border-purple-400 focus:bg-white/10 focus:ring-2 focus:ring-purple-500/20"
            />
          </div>

          {/* FILTERS */}

          <div className="mt-4">
            <p className="mb-2 text-xs font-medium text-white/40">Roll</p>

            <div className="flex flex-wrap gap-2">
              {roles.map((role) => (
                <button
                  key={role.value}
                  type="button"
                  onClick={() => setRoleFilter(role.value)}
                  className={`rounded-lg border px-3 py-2 text-xs font-medium transition-all ${
                    roleFilter === role.value
                      ? "selected-blue"
                      : "border-white/10 bg-white/5 text-white/60 hover:border-white/20 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  {role.label}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-4">
            <p className="mb-2 text-xs font-medium text-white/40">Avdelning</p>

            <div className="flex flex-wrap gap-2">
              {departments.map((department) => (
                <button
                  key={department.value}
                  type="button"
                  onClick={() => setDepartmentFilter(department.value)}
                  className={`rounded-lg border px-3 py-2 text-xs font-medium transition-all ${
                    departmentFilter === department.value
                      ? "selected-blue"
                      : "border-white/10 bg-white/5 text-white/60 hover:border-white/20 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  {department.label}
                </button>
              ))}
            </div>
          </div>

          {/* USER LIST */}

          <div className="mt-5">
            <div className="mb-2 flex items-center justify-between">
              <p className="text-xs font-medium text-white/40">Användare</p>

              <span className="text-xs text-white/30">
                {visibleUsers.length} användare
              </span>
            </div>

            <div className="max-h-64 space-y-2 overflow-y-auto pr-1">
              {isLoading ? (
                <div className="py-8 text-center text-sm text-white/40">
                  Laddar användare...
                </div>
              ) : visibleUsers.length === 0 ? (
                <div className="rounded-xl border border-white/10 bg-white/5 py-8 text-center text-sm text-white/40">
                  Inga användare hittades
                </div>
              ) : (
                visibleUsers.map((user) => {
                  const isSelected = selected === user.id;

                  return (
                    <button
                      key={user.id}
                      type="button"
                      onClick={() => setSelected(user.id)}
                      className={`flex w-full items-center gap-3 rounded-xl border p-3 text-left transition-all ${
                        isSelected
                          ? "selected-blue"
                          : "border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/10"
                      }`}
                    >
                      {/* AVATAR */}

                      <div
                        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-linear-to-br from-blue-500 to-purple-500 text-sm font-semibold text-white ${
                          isSelected ? "ring-2 ring-purple-400/50" : ""
                        }`}
                      >
                        {getInitial(user.name)}
                      </div>

                      {/* INFO */}

                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <p className="truncate text-sm font-medium text-white">
                            {user.name}
                          </p>

                          {user.role?.name && (
                            <span className="rounded-md bg-blue-500/15 px-2 py-0.5 text-[10px] font-medium text-blue-300">
                              {user.role.name}
                            </span>
                          )}
                        </div>

                        <p className="truncate text-xs text-white/40">
                          {user.email}
                        </p>

                        <div className="mt-1 flex flex-wrap gap-1">
                          {user.departments?.map((department) => (
                            <span
                              key={department.department}
                              className="rounded-md bg-white/10 px-2 py-0.5 text-[10px] text-white/40"
                            >
                              {departmentLabels[department.department] ??
                                department.department}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* SELECTED */}

                      <div
                        className={`flex h-8 shrink-0 items-center rounded-lg px-3 text-xs font-medium transition-all ${
                          isSelected
                            ? "selected-blue"
                            : "bg-white/10 text-white/50"
                        }`}
                      >
                        {isSelected ? "Vald" : "Välj"}
                      </div>
                    </button>
                  );
                })
              )}
            </div>
          </div>
        </div>

        {/* FOOTER */}

        <div className="flex items-center justify-between border-t border-white/10 px-6 py-4">
          <div className="text-xs text-white/40">
            {selectedUser ? (
              <>
                Vald:{" "}
                <span className="font-medium text-white/70">
                  {selectedUser.name}
                </span>
              </>
            ) : (
              "Ingen användare vald"
            )}
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-white transition-all hover:border-white/20 hover:bg-white/10"
            >
              Avbryt
            </button>

            <button
              type="button"
              disabled={!selected}
              onClick={handleSubmit}
              className={`rounded-lg px-5 py-2 text-sm font-medium transition-all ${
                selected
                  ? "bg-linear-to-r from-purple-600 to-blue-600 text-white shadow-lg shadow-purple-500/20 hover:brightness-110"
                  : "cursor-not-allowed bg-white/10 text-white/30"
              }`}
            >
              Bjud in
            </button>
          </div>
        </div>
      </div>

      <FeedbackBubble
        open={notify}
        message="Användaren bjöds in!"
        onClose={() => setNotify(false)}
      />
    </div>,
    document.body,
  );
};

export default InviteUserModal;

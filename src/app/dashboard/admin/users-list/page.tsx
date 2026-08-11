"use client";

import { Fragment, useState } from "react";
import { api } from "~/trpc/react";
import { RiEdit2Fill } from "react-icons/ri";
import { FaTrashAlt } from "react-icons/fa";
import { toast } from "sonner";
import { CreateUserButton } from "~/app/_components/modals/create-user/createUserButton";
import { FiSearch } from "react-icons/fi";
import CustomSelect from "~/app/_components/customSelect";

const ROLE_MAP = {
  USER: "cmmqzjj6l0006k0u9lwzfyu3l",
  HANDLER: "cmmqzjj6f0005k0u9itc44n56",
  ADMIN: "ADMIN_ROLE_ID_HÄR",
} as const;

const ROLE_PERMISSIONS: Record<RoleKey, string[]> = {
  USER: ["Se egna ärenden", "Skapa ärenden", "Kommentera ärenden"],
  HANDLER: ["Se alla ärenden", "Ändra ärenden", "Tilldela ärenden"],
  ADMIN: ["Full åtkomst", "Hantera användare", "Alla rättigheter"],
};

type RoleKey = keyof typeof ROLE_MAP;

type FilterType = "all" | "users" | "handlers";

export default function ListUsersPage() {
  const utils = api.useUtils();

  const { data: users, isLoading } = api.user.listAll.useQuery({
    limit: 20,
  });

  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [editRole, setEditRole] = useState<RoleKey>("USER");
  const [userToDelete, setUserToDelete] = useState<string | null>(null);
  const [roleFilter, setRoleFilter] = useState<
    "ALL" | "USER" | "HANDLER" | "ADMIN"
  >("ALL");

  const [departmentFilter, setDepartmentFilter] = useState<
    "ALL" | "IT" | "HR" | "CAMPAIGN" | "PRODUCT" | "CUSTOMERCLUB"
  >("ALL");

  const [search, setSearch] = useState("");

  const deleteUser = api.user.deleteUser.useMutation({
    onSuccess: async () => {
      toast.success("Användaren raderades");
      await utils.user.listAll.invalidate();
      setUserToDelete(null);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const filteredUsers = users?.users.filter((user) => {
    const searchText = search.toLowerCase();

    const matchesSearch =
      user.name?.toLowerCase().includes(searchText) ||
      user.email?.toLowerCase().includes(searchText) ||
      user.role?.name.toLowerCase().includes(searchText);

    const matchesRole = roleFilter === "ALL" || user.role?.name === roleFilter;

    const matchesDepartment =
      departmentFilter === "ALL" ||
      user.departments.some(
        (department) => department.department === departmentFilter,
      );

    return matchesSearch && matchesRole && matchesDepartment;
  });

  const updateUser = api.user.updateUser.useMutation({
    onSuccess: async () => {
      await utils.user.listAll.invalidate();
      setEditingUserId(null);
      toast.success("Användaren uppdaterad");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  if (isLoading) {
    return (
      <main className="main-page-layout">
        <div className="container">
          <div className="rounded-2xl bg-white/5 p-6 backdrop-blur-lg">
            <div className="mb-6 h-8 w-40 animate-pulse rounded-lg bg-white/10" />
            <div className="mb-6 h-12 w-full animate-pulse rounded-xl bg-white/10" />

            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className="h-16 animate-pulse rounded-xl bg-white/5"
                />
              ))}
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (!users || users.users.length === 0) {
    return (
      <main className="main-page-layout">
        <div className="container">
          <p className="text-center text-white/70">Inga användare hittades</p>
        </div>
      </main>
    );
  }

  return (
    <main className="main-page-layout">
      <div className="container">
        <div className="rounded-2xl bg-white/5 p-6 backdrop-blur-lg">
          {/* HEADER */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="page-header">Användare</h1>

              <p className="mt-1 text-sm text-white/50">
                Hantera användare och deras behörigheter.
              </p>
            </div>

            <CreateUserButton />
          </div>

          {/* SEARCH */}
          <div className="mt-6 mb-6 flex flex-col gap-3 lg:flex-row">
            {/* SÖK */}
            <div className="relative flex-1">
              <FiSearch
                className="absolute top-1/2 left-4 -translate-y-1/2 text-white/40"
                size={18}
              />

              <input
                type="text"
                placeholder="Sök bland användare..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="input w-full rounded-xl py-3 pr-4 pl-11"
              />
            </div>

            {/* ROLL */}
            <CustomSelect
              value={roleFilter}
              onChange={(value) =>
                setRoleFilter(value as "ALL" | "USER" | "HANDLER" | "ADMIN")
              }
              options={[
                {
                  value: "ALL",
                  label: "Alla roller",
                },
                {
                  value: "USER",
                  label: "Användare",
                },
                {
                  value: "HANDLER",
                  label: "Handläggare",
                },
                {
                  value: "ADMIN",
                  label: "Admin",
                },
              ]}
              className="w-full lg:w-48"
            />

            {/* AVDELNING */}
            <CustomSelect
              value={departmentFilter}
              onChange={(value) =>
                setDepartmentFilter(
                  value as
                    | "ALL"
                    | "IT"
                    | "HR"
                    | "CAMPAIGN"
                    | "PRODUCT"
                    | "CUSTOMERCLUB",
                )
              }
              options={[
                {
                  value: "ALL",
                  label: "Alla avdelningar",
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
              ]}
              className="w-full lg:w-52"
            />
          </div>

          {/* TABLE */}
          <div className="overflow-hidden rounded-2xl border border-white/5 bg-white/2">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b border-white/10 text-left text-sm text-white/50">
                    <th className="px-4 py-4 font-medium">Namn</th>
                    <th className="px-4 py-4 font-medium">Email</th>
                    <th className="px-4 py-4 font-medium">Roll</th>
                    <th className="px-4 py-4 text-right font-medium">
                      Åtgärder
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {filteredUsers?.map((user) => {
                    const isAdmin = user.role?.name === "ADMIN";

                    return (
                      <Fragment key={user.id}>
                        {/* USER ROW */}
                        <tr className="border-b border-white/5 transition-colors hover:bg-white/5">
                          <td className="px-4 py-4">
                            <span className="font-medium text-white">
                              {user.name || "—"}
                            </span>
                          </td>

                          <td className="px-4 py-4 text-white/70">
                            {user.email}
                          </td>

                          <td className="px-4 py-4">
                            <span className="inline-flex h-7 items-center rounded-full bg-blue-500/20 px-3 text-xs font-medium text-blue-300">
                              {user.role?.name || "Ingen roll"}
                            </span>
                          </td>

                          <td className="px-4 py-4">
                            <div className="flex justify-end gap-2">
                              {/* EDIT */}
                              <button
                                onClick={() => {
                                  if (editingUserId === user.id) {
                                    setEditingUserId(null);
                                  } else {
                                    setEditingUserId(user.id);
                                    setEditName(user.name || "");
                                    setEditRole(
                                      (user.role?.name as RoleKey) || "USER",
                                    );
                                  }
                                }}
                                className="cursor-pointer rounded-lg border border-white/10 bg-white/5 p-2 text-white/70 transition-all hover:border-blue-500/40 hover:bg-blue-500/20 hover:text-blue-300"
                              >
                                <RiEdit2Fill size={18} />
                              </button>

                              {/* DELETE */}
                              {!isAdmin && (
                                <button
                                  onClick={() => setUserToDelete(user.id)}
                                  className="cursor-pointer rounded-lg border border-white/10 bg-white/5 p-2 text-white/70 transition-all hover:border-red-500/40 hover:bg-red-500/20 hover:text-red-300"
                                >
                                  <FaTrashAlt size={18} />
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>

                        {/* EDIT PANEL */}
                        {editingUserId === user.id && (
                          <tr className="border-b border-white/5 bg-white/3">
                            <td colSpan={4} className="px-4 py-6">
                              <div className="rounded-xl border border-white/5 bg-white/2 p-4">
                                <div className="flex flex-col gap-5">
                                  <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                                    {/* NAME + ROLE */}
                                    <div className="flex flex-col gap-4 sm:flex-row">
                                      <div className="flex flex-col gap-2">
                                        <label className="text-sm font-medium text-white/60">
                                          Namn
                                        </label>

                                        <input
                                          value={editName}
                                          onChange={(e) =>
                                            setEditName(e.target.value)
                                          }
                                          className="input rounded-xl px-4 py-2.5"
                                          placeholder="Namn"
                                        />
                                      </div>

                                      <div className="flex flex-col gap-2">
                                        <label className="text-sm font-medium text-white/60">
                                          Roll
                                        </label>

                                        <select
                                          value={editRole}
                                          onChange={(e) =>
                                            setEditRole(
                                              e.target.value as RoleKey,
                                            )
                                          }
                                          disabled={isAdmin}
                                          className={`cursor-pointer rounded-xl border border-white/10 px-4 py-2.5 text-white transition-all outline-none ${
                                            isAdmin
                                              ? "cursor-not-allowed bg-white/5 text-white/30"
                                              : "bg-white/5 hover:bg-white/10 focus:border-purple-500 focus:bg-white/10"
                                          }`}
                                        >
                                          <option
                                            value="USER"
                                            className="text-black"
                                          >
                                            Användare
                                          </option>

                                          <option
                                            value="HANDLER"
                                            className="text-black"
                                          >
                                            Handläggare
                                          </option>

                                          <option
                                            value="ADMIN"
                                            className="text-black"
                                          >
                                            Admin
                                          </option>
                                        </select>
                                      </div>
                                    </div>

                                    {/* PERMISSIONS */}
                                    <div className="rounded-xl border border-white/5 bg-white/5 p-4">
                                      <p className="mb-3 text-center text-xs font-medium tracking-wide text-white/50 uppercase">
                                        Behörigheter
                                      </p>

                                      <ul className="space-y-2 text-sm text-white/70">
                                        {ROLE_PERMISSIONS[editRole].map(
                                          (permission) => (
                                            <li
                                              key={permission}
                                              className="flex items-center gap-2"
                                            >
                                              <span className="h-1.5 w-1.5 rounded-full bg-blue-400" />
                                              {permission}
                                            </li>
                                          ),
                                        )}
                                      </ul>
                                    </div>
                                  </div>

                                  {/* SAVE */}
                                  <div className="flex justify-end">
                                    <button
                                      onClick={() =>
                                        updateUser.mutate({
                                          id: user.id,
                                          name: editName,
                                          roleId: ROLE_MAP[editRole],
                                        })
                                      }
                                      disabled={updateUser.isPending}
                                      className="submit-button disabled:cursor-not-allowed disabled:opacity-50"
                                    >
                                      {updateUser.isPending
                                        ? "Sparar..."
                                        : "Spara ändringar"}
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </td>
                          </tr>
                        )}
                      </Fragment>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* DELETE MODAL */}
      {userToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-white/10 bg-[#24164a] p-6 shadow-2xl">
            <h2 className="mb-4 text-xl font-semibold">Är du säker?</h2>

            <p className="mb-6 text-white/70">
              Denna användare kommer att raderas permanent.
            </p>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setUserToDelete(null)}
                className="cursor-pointer rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-white/70 transition-all hover:bg-white/10 hover:text-white"
              >
                Avbryt
              </button>

              <button
                onClick={() => deleteUser.mutate({ id: userToDelete })}
                disabled={deleteUser.isPending}
                className="cursor-pointer rounded-xl bg-red-500/80 px-4 py-2 text-white transition-all hover:bg-red-500 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {deleteUser.isPending ? "Raderar..." : "Radera"}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

"use client";

import { api } from "~/trpc/react";
import { RiEdit2Fill } from "react-icons/ri";
import { FaTrashAlt } from "react-icons/fa";
import { toast } from "sonner";
import { useState } from "react";
import { UserSection } from "~/app/_components/create-user/userSection";

const ROLE_MAP = {
  USER: "cmmqoth2d0006x0u9q91ogbrc",
  HANDLER: "cmmqoth270005x0u9ugh7zbj8",
  ADMIN: "ADMIN_ROLE_ID_HÄR",
} as const;

type RoleKey = keyof typeof ROLE_MAP;

export default function ListUsersPage() {
  const utils = api.useUtils();
  const { data: users, isLoading } = api.user.listAll.useQuery();

  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [editRole, setEditRole] = useState<RoleKey>("USER");
  const [userToDelete, setUserToDelete] = useState<string | null>(null);

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

  if (isLoading)
    return <p className="text-center text-white/70">Laddar användare...</p>;

  if (!users || users.length === 0)
    return <p className="text-center text-white/70">Inga användare hittades</p>;

  return (
    <main className="flex min-h-screen justify-center px-6 py-12 text-white">
      <div className="w-full max-w-6xl rounded-2xl bg-white/5 p-6 backdrop-blur-lg">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold tracking-wide">Användare</h1>

          <div className="flex items-center gap-3">
            <UserSection />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-white/10 text-left text-sm text-white/60">
                <th className="px-4 py-3">Namn</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Roll</th>
                <th className="px-4 py-3 text-right">Åtgärder</th>
              </tr>
            </thead>

            <tbody>
              {users.map((user) => {
                const isAdmin = user.role?.name === "ADMIN";

                return (
                  <>
                    {/* USER ROW */}
                    <tr
                      key={user.id}
                      className="border-b border-white/5 hover:bg-white/5"
                    >
                      <td className="px-4 py-4">{user.name || "—"}</td>

                      <td className="px-4 py-4 text-white/80">{user.email}</td>

                      <td className="px-4 py-4">
                        <span className="rounded-full bg-blue-500/20 px-3 py-1 text-xs font-medium text-blue-300">
                          {user.role?.name || "Ingen roll"}
                        </span>
                      </td>

                      <td className="px-4 py-4">
                        <div className="flex justify-end gap-3">
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
                            className="cursor-pointer rounded-lg bg-white/10 p-2 hover:bg-green-500/30"
                          >
                            <RiEdit2Fill size={18} />
                          </button>

                          {/* DELETE (inte ADMIN) */}
                          {!isAdmin && (
                            <button
                              onClick={() => setUserToDelete(user.id)}
                              className="cursor-pointer rounded-lg bg-white/10 p-2 hover:bg-red-500/30"
                            >
                              <FaTrashAlt size={18} />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>

                    {/* EDIT DROPDOWN */}
                    {editingUserId === user.id && (
                      <tr className="bg-white/5">
                        <td colSpan={4} className="px-4 py-6">
                          <div className="flex flex-col gap-4 md:flex-row md:items-end">
                            <input
                              value={editName}
                              onChange={(e) => setEditName(e.target.value)}
                              className="rounded-lg bg-white/10 px-4 py-2"
                              placeholder="Namn"
                            />

                            <select
                              value={editRole}
                              onChange={(e) =>
                                setEditRole(e.target.value as RoleKey)
                              }
                              disabled={isAdmin}
                              className={`cursor-pointer rounded-lg px-4 py-2 ${
                                isAdmin
                                  ? "cursor-not-allowed bg-white/5 text-white/30"
                                  : "bg-white/10"
                              }`}
                            >
                              <option value="USER" className="text-black">
                                User
                              </option>
                              <option value="HANDLER" className="text-black">
                                Handler
                              </option>
                              <option value="ADMIN" className="text-black">
                                Admin
                              </option>
                            </select>

                            <button
                              onClick={() =>
                                updateUser.mutate({
                                  id: user.id,
                                  name: editName,
                                  roleId: ROLE_MAP[editRole],
                                })
                              }
                              className="cursor-pointer rounded-lg bg-blue-600 px-4 py-2"
                            >
                              Spara
                            </button>
                          </div>
                        </td>
                      </tr>
                    )}
                  </>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* DELETE MODAL */}
      {userToDelete && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl bg-gray-900 p-6 shadow-xl">
            <h2 className="mb-4 text-xl font-semibold">Är du säker?</h2>

            <p className="mb-6 text-white/70">
              Denna användare kommer att raderas permanent.
            </p>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setUserToDelete(null)}
                className="cursor-pointer rounded-lg bg-white/10 px-4 py-2"
              >
                Avbryt
              </button>

              <button
                onClick={() => deleteUser.mutate({ id: userToDelete })}
                disabled={deleteUser.isPending}
                className="cursor-pointer rounded-lg bg-red-600 px-4 py-2 disabled:opacity-50"
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

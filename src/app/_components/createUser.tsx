"use client";

import { useState } from "react";
import { api } from "~/trpc/react";
import { toast } from "sonner";

const ROLE_MAP = {
  USER: "cmjq6y3k90006xou99jnwazv2",
  HANDLER: "cmjq6y3k00005xou93d35toga",
} as const;

type RoleKey = keyof typeof ROLE_MAP;

export function CreateUser() {
  const utils = api.useUtils();
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<RoleKey>("USER");

  const createUser = api.user.create.useMutation({
    onSuccess: async () => {
      await utils.ticket.invalidate();
      setEmail("");
      setName("");
      setPassword("");
      setRole("USER");
      toast("Användaren skapades!");
    },
    onError: (error) => {
      toast(error.message);
    },
  });

  return (
    <div className="flex flex-col">
      <h1 className="text-center text-2xl">Skapa Användare</h1>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          createUser.mutate({ email, name, password, roleId: ROLE_MAP[role] });
        }}
        className="flex flex-col gap-2 lg:h-80 lg:w-xl"
      >
        <label htmlFor="email">Email</label>
        <input
          type="text"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="rounded-lg border border-black/50 bg-white/10 p-7 px-4 py-2 text-black required:border-red-500 required:text-red-500"
        />
        <label htmlFor="name">Namn</label>
        <input
          type="text"
          placeholder="Namn"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="rounded-lg border border-black/50 bg-white/10 p-7 px-4 py-2 text-black required:border-red-500 required:text-red-500"
        />
        <label htmlFor="password">Lösenord</label>
        <input
          type="text"
          placeholder="Lösenord"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="rounded-lg border border-black/50 bg-white/10 p-7 px-4 py-2 text-black required:border-red-500 required:text-red-500"
        />
        <label htmlFor="role">Typ av användare</label>
        <select
          id="role"
          name="role"
          value={role}
          onChange={(e) => setRole(e.target.value as RoleKey)}
          className="rounded-lg border border-black/50 bg-white/10 p-7 px-4 py-2 text-black"
        >
          <option value="USER">Vanlig användare</option>
          <option value="HANDLER">Handläggare</option>
        </select>
        <button
          type="submit"
          className="rounded-full bg-blue-500 px-10 py-3 text-white"
        >
          Submit
        </button>
      </form>
    </div>
  );
}

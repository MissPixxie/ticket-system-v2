"use client";

import { set } from "better-auth";
import { useState } from "react";
import { api } from "~/trpc/react";

export function CreateTicket() {
  const utils = api.useUtils();
  const [title, setTitle] = useState("");
  const [issue, setIssue] = useState("");
  const [department, setDepartment] = useState<
    "IT" | "HR" | "CAMPAIGN" | "PRODUCT" | "CUSTOMERCLUB"
  >("IT");

  const createTicket = api.ticket.create.useMutation({
    onSuccess: async () => {
      await utils.ticket.invalidate();
      setTitle("");
      setIssue("");
      setDepartment("IT");
    },
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        createTicket.mutate({ title, issue, department });
      }}
      className="flex flex-col gap-2 lg:h-80 lg:w-3xl"
    >
      <label htmlFor="title">Titel</label>
      <input
        type="text"
        placeholder="Titel"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="rounded-lg border border-black/50 bg-white/10 p-7 px-4 py-2 text-black required:border-red-500 required:text-red-500"
      />
      <label htmlFor="issue">Beskriv problemet</label>
      <textarea
        placeholder="Beskriv problemet"
        value={issue}
        onChange={(e) => setIssue(e.target.value)}
        className="h-full rounded-lg border border-black/50 bg-white/10 p-7 px-4 py-2 text-black required:border-red-500 required:text-red-500"
      />
      <button
        type="submit"
        className="rounded-full bg-blue-500 px-10 py-3 text-white"
      >
        Submit
      </button>
    </form>
  );
}

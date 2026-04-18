"use client";

import { useState } from "react";
import { api } from "~/trpc/react";
import TicketCard from "./cards/ticketCard";
import { useSocket } from "../socketProvider";
import { TicketSection } from "./modals/create-ticket/ticketSection";
import { PickSection } from "./modals/handler-picker/pickSection";

const priorityClasses: Record<string, string> = {
  LOW: "bg-green-500 text-white",
  MEDIUM: "bg-yellow-500 text-black",
  URGENT: "bg-red-600 text-white",
};

export function MessagesTable() {
  const [filter, setFilter] = useState<string>("ALL");
  const [search, setSearch] = useState("");
  const { socket } = useSocket();
  const utils = api.useUtils();
  const { data: me } = api.user.me.useQuery();

  //   const { data: messages, isLoading } = api.message.listMessages.useQuery({
  //     threadId,
  //   });

  //   const sortedMessages = messages ? [...messages].reverse() : [];

  //   const createMessage = api.message.createMessage.useMutation({
  //     onSuccess: () => {
  //       console.log("Message created, invalidating messages for id:", threadId);
  //       utils.message.listMessages.invalidate();
  //     },
  //   });

  const handleSetFilter = (value: string) => {
    setFilter(value);
  };

  //   if (isLoading) return <p>Laddar meddelanden...</p>;
  //   if (!messages || messages.length === 0)
  //     return <p>Inga meddelanden hittades</p>;

  return (
    <div className="primary-background mt-15 rounded-2xl shadow-lg/15 backdrop-blur-lg">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 p-5">
        <div className="flex items-center gap-4">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="rounded-lg bg-white/10 px-3 py-2 text-sm"
          >
            <option value="ALL" className="text-black">
              Öppnade
            </option>
            <option value="OPEN" className="text-black">
              Oöppnade
            </option>
          </select>

          <input
            type="text"
            placeholder="Sök meddelanden..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="rounded-lg bg-white/10 px-3 py-2 text-sm"
          />
        </div>
      </div>

      {/* TABLE HEADER */}

      <div className="grid grid-cols-[1fr_1fr_1fr_1fr_1fr_1fr] border-b border-white/10 px-5 py-4 text-sm text-white/70">
        <div className="font-semibold">Från</div>
        <div className="font-semibold">Till</div>
        <div className="font-semibold">Prioritet</div>
        <div className="font-semibold">Datum</div>
      </div>

      {/* ROWS */}
      {/*
      {visibleTickets?.map((ticket) => (
        <div key={ticket.id} className="border-t border-white/5">
          <div
            className="grid cursor-pointer grid-cols-[1fr_1fr_1fr_1fr_1fr_1fr] items-center px-5 py-4 hover:bg-white/5"
            onClick={() =>
              setSelectedTicketId(
                selectedTicketId === ticket.id ? null : ticket.id,
              )
            }
          >
            <div>{ticket.title}</div>
            <div>{ticket.department}</div>

            <div>
              <span
                className={`rounded-md px-2 py-1 text-xs ${
                  priorityClasses[ticket.priority]
                }`}
              >
                {ticket.priority}
              </span>
            </div>

            <div>{ticket.createdAt.toLocaleDateString()}</div>
          </div>

          {selectedTicketId === ticket.id && (
            <div className="p-5">
              <TicketCard {...ticket} currentUserId={null} />
            </div>
          )}
        </div>
      ))} */}
    </div>
  );
}

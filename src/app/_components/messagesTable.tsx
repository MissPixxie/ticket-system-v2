"use client";

import { useState } from "react";
import { api } from "~/trpc/react";
import TicketCard from "./cards/ticketCard";
import { useSocket } from "../socketProvider";
import { TicketSection } from "./modals/create-ticket/ticketSection";
import { PickSection } from "./modals/handler-picker/pickSection";
import { FaTrashAlt } from "react-icons/fa";

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

  const { data: messages, isLoading } = api.message.listUserMessages.useQuery();

  console.log("Fetched messages:", messages);

  //   const sortedMessages = messages ? [...messages].reverse() : [];

  const deleteMessage = api.message.deleteMessage.useMutation({
    onSuccess: () => {
      utils.message.listUserMessages.invalidate();
    },
  });

  const handleDeleteMessage = (messageId: string) => {
    deleteMessage.mutate({ id: messageId });
  };

  const handleSetFilter = (value: string) => {
    setFilter(value);
  };

  return (
    <div className="primary-background rounded-2xl shadow-lg/15 backdrop-blur-lg">
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

      <div className="grid grid-cols-[1fr_2fr_1fr_auto] border-b border-white/10 px-5 py-4 text-sm text-white/70">
        <div className="font-semibold">Från</div>
        <div className="font-semibold">Meddelande</div>
        <div className="font-semibold">Datum</div>
      </div>

      {/* ROWS */}

      {messages?.map((message) => (
        <div key={message.id} className="border-t border-white/5">
          <div className="grid grid-cols-[1fr_2fr_1fr_auto] border-b border-white/10 px-5 py-4 text-sm text-white/70">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-linear-to-br from-blue-500 to-purple-500 text-xs font-semibold text-white">
                {message.createdBy?.name?.charAt(0)}
              </div>

              <span>{message.createdBy?.name}</span>
            </div>
            <div>{message.message}</div>
            <div>{message.createdAt.toLocaleDateString()}</div>
            <button
              onClick={() => handleDeleteMessage(message.id)}
              className="max-w-9 cursor-pointer rounded-lg bg-white/10 p-2 hover:bg-red-500/30"
            >
              <FaTrashAlt size={18} />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

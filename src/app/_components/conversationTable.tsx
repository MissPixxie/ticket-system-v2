"use client";

import { useState } from "react";
import { api, type RouterOutputs } from "~/trpc/react";
import TicketCard from "./cards/ticketCard";
import { useSocket } from "../socketProvider";
import { TicketSection } from "./modals/create-ticket/ticketSection";
import { PickSection } from "./modals/handler-picker/pickSection";
import { FaTrashAlt } from "react-icons/fa";
import ChatBox from "./chatBox";

const priorityClasses: Record<string, string> = {
  LOW: "bg-green-500 text-white",
  MEDIUM: "bg-yellow-500 text-black",
  URGENT: "bg-red-600 text-white",
};

export function ConversationTable() {
  const [filter, setFilter] = useState<string>("ALL");
  const [search, setSearch] = useState("");
  const { socket } = useSocket();
  const utils = api.useUtils();
  const { data: me } = api.user.me.useQuery();
  const [selectedConversation, setSelectedConversation] = useState<
    RouterOutputs["message"]["listUserConversations"][number] | null
  >(null);

  const { data: conversations, isLoading } =
    api.message.listUserConversations.useQuery();

  const deleteMessage = api.message.deleteConversation.useMutation({
    onSuccess: () => {
      utils.message.listUserConversations.invalidate();
    },
  });

  const handleDeleteMessage = (conversationId: string) => {
    deleteMessage.mutate({ conversationId });
  };

  const handleSetFilter = (value: string) => {
    setFilter(value);
  };

  return (
    <div className="flex flex-col gap-6">
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
          <div className="font-semibold">Senaste meddelandet</div>
          <div className="font-semibold">Datum</div>
        </div>

        {conversations?.map((conversation) => {
          const latestMessage = conversation.messages[0];

          return (
            <div
              key={conversation.id}
              className="cursor-pointer border-t border-white/5 hover:bg-white/5"
              onClick={() => setSelectedConversation(conversation)}
            >
              <div className="grid grid-cols-[1fr_2fr_1fr_auto] border-b border-white/10 px-5 py-4 text-sm text-white/70">
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-linear-to-br from-blue-500 to-purple-500 text-xs font-semibold text-white">
                    {latestMessage?.sender?.id === me?.id
                      ? "D"
                      : latestMessage?.sender?.name?.charAt(0)}
                  </div>

                  <span>
                    {latestMessage?.sender?.id === me?.id
                      ? "Du"
                      : latestMessage?.sender?.name}
                  </span>
                </div>

                <div>
                  {latestMessage && latestMessage?.content.length > 20
                    ? latestMessage.content.slice(0, 20) + "..."
                    : latestMessage?.content}
                </div>

                <div>{latestMessage?.createdAt.toLocaleDateString()}</div>

                {latestMessage && (
                  <button
                    onClick={() =>
                      handleDeleteMessage(latestMessage.conversationId)
                    }
                    className="max-w-9 cursor-pointer rounded-lg bg-white/10 p-2 hover:bg-red-500/30"
                  >
                    <FaTrashAlt size={18} />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
      {selectedConversation && (
        <div className="primary-background rounded-2xl p-3 shadow-lg/15 backdrop-blur-lg">
          <ChatBox conversationId={selectedConversation.id} context="EMAIL" />
        </div>
      )}
    </div>
  );
}

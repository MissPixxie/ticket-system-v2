"use client";

import { api } from "~/trpc/react";
import ChatBox from "~/app/_components/chatBox";
import { InviteSection } from "~/app/_components/modals/invite-user/inviteSection";
import { TiDocumentText } from "react-icons/ti";
import { use } from "react";
import { PickSection } from "~/app/_components/modals/handler-picker/pickSection";

//import { useSocket } from "~/app/_components/socketProvider";

const priorityClasses: Record<string, string> = {
  LOW: "bg-green-500 text-white",
  MEDIUM: "bg-yellow-500 text-black",
  URGENT: "bg-red-600 text-white",
};

const statusClasses: Record<string, string> = {
  OPEN: "bg-blue-500 text-white",
  IN_PROGRESS: "bg-amber-400 text-black",
  CLOSED: "bg-gray-600 text-white",
};

export default function TicketPage({
  params,
}: {
  params: Promise<{ ticketId: string }>;
}) {
  const { ticketId } = use(params);
  const { data: ticket, isLoading } = api.ticket.getTicketById.useQuery({
    id: ticketId,
  });

  const { data: me } = api.user.me.useQuery();
  const utils = api.useUtils();
  //const { socket } = useSocket();

  const updateTicket = api.ticket.updateTicket.useMutation({
    onSuccess: () => {
      utils.ticket.getTicketById.invalidate();
      utils.ticket.listAllTickets.invalidate();
    },
  });

  const handleSetStatus = (ticketId: string) => {
    updateTicket.mutate({
      id: ticketId,
      status: "IN_PROGRESS",
      assignedToId: me?.id || undefined,
    });
  };

  const handleSetPriority = (ticketId: string, priority: string) => {
    updateTicket.mutate({
      id: ticketId,
      priority: priority as "LOW" | "MEDIUM" | "HIGH" | "URGENT",
    });
  };

  if (isLoading || !ticket) {
    return (
      <main className="flex min-h-screen items-center justify-center text-white/70">
        Laddar ticket...
      </main>
    );
  }

  return (
    <main className="main-page-layout">
      <button
        onClick={() => history.back()}
        className="text-sm mb-4 text-white/60 transition hover:text-white"
      >
        ← Tillbaka
      </button>
      <div className="container">
        <div className="flex flex-col gap-4 rounded-2xl bg-white/5 p-6 shadow-lg/15 backdrop-blur-lg md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold">{ticket.title}</h1>
            <p className="text-sm text-white/60">{ticket.department}</p>
          </div>

          <div className="flex gap-2">
            <span
              className={`rounded-full px-3 py-1 text-xs font-semibold ${
                statusClasses[ticket.status]
              }`}
            >
              {ticket.status}
            </span>

            <span
              className={`rounded-full px-3 py-1 text-xs font-semibold ${
                priorityClasses[ticket.priority]
              }`}
            >
              {ticket.priority}
            </span>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-2">
            <div className="rounded-2xl bg-white/5 p-6 shadow-lg/15 backdrop-blur-lg">
              <h2 className="mb-3 text-lg font-semibold">Beskrivning</h2>
              <p className="text-white/80">{ticket.issue}</p>
            </div>

            <div className="rounded-2xl bg-white/5 p-6 shadow-lg/15 backdrop-blur-lg">
              <h2 className="mb-4 text-lg font-semibold">Information</h2>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <p className="text-sm text-white/60">Skapad av</p>
                  <p>{ticket.createdBy?.name}</p>
                </div>

                <div>
                  <p className="text-sm text-white/60">Tilldelad:</p>
                  <div>
                    {ticket.assignedTo ? (
                      <span>{ticket.assignedTo.name}</span>
                    ) : (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSetStatus(ticket.id);
                        }}
                        className="submit-button"
                      >
                        Acceptera
                      </button>
                    )}
                  </div>
                </div>

                <div>
                  <p className="text-sm text-white/60">Skapad</p>
                  <p>{new Date(ticket.createdAt).toLocaleString()}</p>
                </div>

                <div>
                  <p className="text-sm text-white/60">Status</p>
                  <p>{ticket.status}</p>
                </div>
              </div>
              <div className="mt-4 flex flex-row gap-4">
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-semibold">Status</label>
                  <select
                    value={ticket.status}
                    onClick={(e) => e.stopPropagation()}
                    onChange={(e) => handleSetStatus(ticket.id)}
                    className="cursor-pointer rounded bg-gray-700 px-3 py-2 text-white shadow-md/20"
                  >
                    <option>OPEN</option>
                    <option value="IN_PROGRESS">IN PROGRESS</option>
                    <option>CLOSED</option>
                  </select>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-sm font-semibold">Prioritet</label>
                  <select
                    value={ticket.priority}
                    onClick={(e) => e.stopPropagation()}
                    onChange={(e) =>
                      handleSetPriority(ticket.id, e.target.value)
                    }
                    className="cursor-pointer rounded bg-gray-700 px-3 py-2 text-white shadow-md/20"
                  >
                    <option>LOW</option>
                    <option>MEDIUM</option>
                    <option>HIGH</option>
                    <option>URGENT</option>
                  </select>
                </div>
                <div className="ml-auto flex flex-row gap-5 self-end">
                  <InviteSection ticketId={ticket.id} />
                  <button
                    className="flex cursor-pointer flex-row rounded bg-gray-700 p-2 shadow-md/20 hover:bg-gray-600"
                    title="Ticket History"
                  >
                    Ticket History
                    <TiDocumentText className="self-center" size={22} />
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-2xl bg-white/5 p-6 shadow-lg/15 backdrop-blur-lg">
            {ticket.thread?.id && me?.id && (
              <ChatBox
                threadId={ticket.thread?.id ?? null}
                currentUserId={me.id}
              />
            )}
          </div>
        </div>
      </div>
    </main>
  );
}

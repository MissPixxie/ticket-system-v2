"use client";

import { useState } from "react";
import { api } from "~/trpc/react";
import TicketCard from "./cards/ticketCard";
import { useSocket } from "../socketProvider";
import { TicketSection } from "./modals/create-ticket/ticketSection";
import { PickSection } from "./modals/handler-picker/pickSection";
import Link from "next/link";
import CustomSelect from "./customSelect";
import SkeletonTickets from "./skeletonComponents/pages/skeletonTickets";

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

interface TicketTableProps {
  currentUserRole: "ADMIN" | "HANDLER" | "USER";
}

export function TicketTable({ currentUserRole }: TicketTableProps) {
  const { data: tickets, isLoading } = api.ticket.listAllTickets.useQuery({
    limit: 20,
  });
  const [filter, setFilter] = useState<string>("ALL");
  const [departmentFilter, setDepartmentFilter] = useState<string>("ALL");
  const [search, setSearch] = useState("");
  const { socket } = useSocket();
  const utils = api.useUtils();
  const { data: me } = api.user.me.useQuery();

  const updateTicket = api.ticket.updateTicket.useMutation({
    onSuccess: async (ticket) => {
      await utils.ticket.invalidate();
      if (!socket) return;
      socket.emit("join:room", ticket.id);
    },
  });

  const handleSetStatus = (ticketId: string) => {
    updateTicket.mutate({
      id: ticketId,
      status: "IN_PROGRESS",
      assignedToId: me?.id || undefined,
    });
  };

  const handleSetFilter = (value: string) => {
    setFilter(value);
  };

  const getTicketUrl = (ticketId: string) => {
    switch (currentUserRole) {
      case "USER":
        return `/dashboard/user/my-tickets/${ticketId}`;

      case "HANDLER":
        return `/dashboard/handler/tickets/${ticketId}`;

      case "ADMIN":
        return `/dashboard/admin/tickets/${ticketId}`;
    }
  };

  const filteredTickets = tickets?.tickets.filter((ticket) => {
    const userId = me?.id;

    if (
      currentUserRole === "HANDLER" &&
      ticket.assignedTo &&
      ticket.assignedTo.id !== userId
    ) {
      return false;
    }

    if (departmentFilter !== "ALL" && ticket.department !== departmentFilter) {
      return false;
    }

    switch (filter) {
      case "MINA":
        return ticket.assignedTo?.id === userId;

      case "OPEN":
        return ticket.status === "OPEN";

      case "IN_PROGRESS":
        return ticket.status === "IN_PROGRESS";

      case "CLOSED":
        return ticket.status === "CLOSED";

      default:
        return true;
    }
  });

  const visibleTickets = filteredTickets?.filter((ticket) => {
    const searchLower = search.toLowerCase();
    return (
      ticket.title.toLowerCase().includes(searchLower) ||
      ticket.status.toLowerCase().includes(searchLower) ||
      ticket.priority.toLowerCase().includes(searchLower) ||
      ticket.department.toLowerCase().includes(searchLower) ||
      ticket.assignedTo?.name?.toLowerCase().includes(searchLower)
    );
  });

  if (isLoading) return <SkeletonTickets />;
  if (!tickets || tickets.tickets.length === 0)
    return (
      <div className="flex justify-between">
        <p>Inga tickets hittades</p>
        <TicketSection />
      </div>
    );

  return (
    <div className="primary-background mt-15 rounded-2xl shadow-lg/15 backdrop-blur-lg">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 p-5">
        <div className="flex items-center gap-4">
          <span className="text-sm text-white/60">Status:</span>
          <CustomSelect
            value={filter}
            onChange={setFilter}
            options={[
              {
                value: "ALL",
                label: "Alla",
              },
              {
                value: "OPEN",
                label: "Öppna",
              },
              {
                value: "IN_PROGRESS",
                label: "Pågående",
              },
              {
                value: "CLOSED",
                label: "Stängda",
              },
            ]}
            size="sm"
            className="w-32"
          />

          <span className="text-sm text-white/60">Avdelning:</span>

          <CustomSelect
            value={departmentFilter}
            onChange={setDepartmentFilter}
            options={[
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
            ]}
            size="sm"
            className="w-36"
          />

          <input
            type="text"
            placeholder="Sök tickets..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input rounded-lg px-3 py-2 text-sm"
          />
        </div>

        <TicketSection />
      </div>

      {/* TABLE HEADER */}

      <div className="grid grid-cols-[1fr_1fr_1fr_1fr_1fr_1fr] border-b border-white/10 px-5 py-4 text-sm text-white/70">
        <div className="font-semibold">Titel</div>
        <div className="font-semibold">Avdelning</div>
        <div className="font-semibold">Status</div>
        <div className="font-semibold">Prioritet</div>
        <div className="font-semibold">Skapad</div>
        <div className="font-semibold">Hanteras av</div>
      </div>

      {/* ROWS */}

      {visibleTickets?.map((ticket) => (
        <div key={ticket.id} className="border-t border-white/5">
          <div className="grid cursor-pointer grid-cols-[1fr_1fr_1fr_1fr_1fr_1fr] items-center px-5 py-4 hover:bg-white/5">
            <Link href={getTicketUrl(ticket.id)} className="contents">
              <div>{ticket.title}</div>

              <div>{ticket.department}</div>

              <div>
                <span
                  className={`rounded-md px-2 py-1 text-xs ${
                    statusClasses[ticket.status]
                  }`}
                >
                  {ticket.status.replace("_", " ")}
                </span>
              </div>

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

              <div>
                {(() => {
                  if (!ticket.assignedTo) {
                    switch (currentUserRole) {
                      case "USER":
                        return <span>Ingen</span>;

                      case "HANDLER":
                        return (
                          <button
                            disabled={ticket.createdById === me?.id}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleSetStatus(ticket.id);
                            }}
                            title={
                              ticket.createdById === me?.id
                                ? "Du kan inte acceptera din egen ticket."
                                : "Acceptera ticket"
                            }
                            className={`submit-button ${
                              ticket.createdById === me?.id
                                ? "cursor-not-allowed opacity-50"
                                : ""
                            }`}
                          >
                            Acceptera
                          </button>
                        );

                      case "ADMIN":
                        return <PickSection ticketId={ticket.id} />;

                      default:
                        return null;
                    }
                  }

                  return <span>{ticket.assignedTo.name}</span>;
                })()}
              </div>
            </Link>
          </div>
        </div>
      ))}

      {!visibleTickets?.length && (
        <div className="p-10 text-center text-white/60">
          Inga tickets hittades
        </div>
      )}
    </div>
  );
}

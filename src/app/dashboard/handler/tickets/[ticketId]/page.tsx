"use client";

import { api } from "~/trpc/react";
import ChatBox from "~/app/_components/chatBox";
import { InviteUserButton } from "~/app/_components/modals/invite-user/inviteUserButton";
import { TiDocumentText } from "react-icons/ti";
import { use, useState } from "react";
import { ImagePreviewModal } from "~/app/_components/modals/imagePreviewModal";
import { FaSearchPlus, FaTrash } from "react-icons/fa";
import { EditImageButton } from "~/app/_components/cloudinaryUpload/feEdit";
import { CldImage } from "next-cloudinary";
import { UploadImageButton } from "~/app/_components/cloudinaryUpload/uploadImageButton";
import { formatPriority, formatStatus } from "~/app/utils/formatNotification";
import SkeletonTicketDetails from "~/app/_components/skeletonComponents/pages/skeletonTicketDetails";
import CustomSelect from "~/app/_components/customSelect";
import TicketReplyAssistant from "~/app/_components/ticketReplyAssistant";

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
  const [suggestion, setSuggestion] = useState("");
  const [isPreviewOpen, setIsPreviewOpen] = useState<boolean>(false);

  const { ticketId } = use(params);
  const { data: ticket, isLoading } = api.ticket.getTicketById.useQuery({
    id: ticketId,
  });
  const { data: messages = [] } = api.message.listMessages.useQuery(
    {
      conversationId: ticket?.conversation?.id ?? "",
    },
    {
      enabled: !!ticket?.conversation?.id,
    },
  );

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
        <SkeletonTicketDetails />
      </main>
    );
  }

  return (
    <main className="main-page-layout">
      <button
        onClick={() => history.back()}
        className="mb-4 text-sm text-white/60 transition hover:text-white"
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
              {formatStatus(ticket.status)}
            </span>

            <span
              className={`rounded-full px-3 py-1 text-xs font-semibold ${
                priorityClasses[ticket.priority]
              }`}
            >
              {formatPriority(ticket.priority)}
            </span>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* VÄNSTER - Huvudarbete */}
          <div className="flex min-h-150 flex-col gap-6 lg:col-span-2">
            {/* Beskrivning */}
            <div className="rounded-2xl bg-white/5 p-6 shadow-lg/15 backdrop-blur-lg">
              <h2 className="mb-3 text-lg font-semibold">Beskrivning</h2>

              <p className="text-white/80">{ticket.issue}</p>
            </div>

            {/* Chatt */}
            <div className="flex flex-col rounded-2xl bg-white/5 p-6 shadow-lg/15 backdrop-blur-lg">
              <h2 className="mb-4 text-lg font-semibold">Meddelanden</h2>

              <div className="min-h-0 flex-1">
                {ticket.conversation?.id && (
                  <ChatBox
                    conversationId={ticket.conversation.id}
                    context="TICKET"
                    suggestion={suggestion}
                  />
                )}
              </div>
              <div className="mt-4">
                <TicketReplyAssistant
                  title={ticket.title}
                  issue={ticket.issue}
                  messages={messages.map((message) => ({
                    senderName: message.sender?.name ?? "Användare",
                    content: message.content,
                  }))}
                  onSuggestion={setSuggestion}
                />
              </div>
            </div>
          </div>

          {/* HÖGER - Information och verktyg */}
          <div className="flex flex-col gap-5">
            {/* Information */}
            <div className="rounded-2xl bg-white/5 p-5 shadow-lg/15 backdrop-blur-lg">
              <h2 className="mb-4 text-lg font-semibold">Information</h2>

              <div className="space-y-3">
                <div>
                  <p className="text-sm text-white/50">Skapad av</p>
                  <p>{ticket.createdBy?.name}</p>
                </div>

                <div>
                  <p className="mb-1 text-sm text-white/50">Tilldelad</p>

                  {ticket.assignedTo ? (
                    <span>{ticket.assignedTo.name}</span>
                  ) : (
                    <button
                      disabled={ticket.createdById === me?.id}
                      onClick={() => handleSetStatus(ticket.id)}
                      title={
                        ticket.createdById === me?.id
                          ? "Du kan inte acceptera en ticket som du själv har skapat."
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
                  )}
                </div>

                <div>
                  <p className="text-sm text-white/50">Deltagare</p>

                  <p>
                    {ticket.conversation?.participants
                      .map((participant) => participant.user.name)
                      .join(", ")}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-white/50">Skapad</p>

                  <p>
                    {new Date(ticket.createdAt).toLocaleDateString()} ·{" "}
                    {new Date(ticket.createdAt).toLocaleTimeString()}
                  </p>
                </div>
              </div>

              {/* Status + prioritet */}
              <div className="mt-5 flex flex-wrap justify-center gap-10 border-t border-white/10 pt-5">
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-semibold">Status</label>

                  <div onClick={(e) => e.stopPropagation()}>
                    <CustomSelect
                      value={ticket.status}
                      onChange={() => handleSetStatus(ticket.id)}
                      options={[
                        {
                          value: "OPEN",
                          label: "Öppen",
                        },
                        {
                          value: "IN_PROGRESS",
                          label: "Pågående",
                        },
                        {
                          value: "CLOSED",
                          label: "Stängd",
                        },
                      ]}
                      size="md"
                      className="w-32"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-sm font-semibold">Prioritet</label>

                  <div onClick={(e) => e.stopPropagation()}>
                    <CustomSelect
                      value={ticket.priority}
                      onChange={(value) => handleSetPriority(ticket.id, value)}
                      options={[
                        {
                          value: "LOW",
                          label: "Låg",
                        },
                        {
                          value: "MEDIUM",
                          label: "Medium",
                        },
                        {
                          value: "HIGH",
                          label: "Hög",
                        },
                        {
                          value: "URGENT",
                          label: "Akut",
                        },
                      ]}
                      size="md"
                      className="w-32"
                    />
                  </div>
                </div>
              </div>

              {/* Verktyg */}
              <div className="mt-5 flex flex-wrap gap-3 border-t border-white/10 pt-5">
                {ticket.conversation?.id && (
                  <InviteUserButton
                    ticketId={ticket.id}
                    conversationId={ticket.conversation.id}
                  />
                )}

                <button
                  disabled
                  title="Kommer snart"
                  className="flex cursor-not-allowed items-center gap-2 rounded-xl border border-white/5 bg-white/5 px-4 py-2.5 text-white/40 opacity-50"
                >
                  Ticket History
                  <TiDocumentText className="self-center" size={22} />
                </button>
              </div>
            </div>

            {/* Bilaga */}
            <div className="rounded-2xl bg-white/5 p-5 shadow-lg/15 backdrop-blur-lg">
              <h2 className="mb-4 text-lg font-semibold">Bilaga</h2>

              {!ticket.imagePublicId ? (
                <UploadImageButton
                  onUpload={(publicId) => {
                    updateTicket.mutate({
                      id: ticket.id,
                      imagePublicId: publicId,
                    });
                  }}
                />
              ) : (
                <div className="space-y-3">
                  <div
                    className="group relative overflow-hidden rounded-2xl"
                    onClick={() => setIsPreviewOpen(true)}
                  >
                    <CldImage
                      src={ticket.imagePublicId}
                      width={600}
                      height={400}
                      alt="Förhandsvisning"
                      className="w-full cursor-pointer object-cover transition duration-300 group-hover:scale-105"
                    />

                    <div className="absolute top-3 right-3 z-20 flex gap-2 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                      <EditImageButton
                        onUpload={(publicId) => {
                          updateTicket.mutate({
                            id: ticket.id,
                            imagePublicId: publicId,
                          });
                        }}
                      />

                      <button
                        type="button"
                        className="rounded-full bg-black/50 p-2 text-white transition hover:bg-red-500"
                        onClick={(e) => {
                          e.stopPropagation();

                          updateTicket.mutate({
                            id: ticket.id,
                            imagePublicId: null,
                          });
                        }}
                      >
                        <FaTrash size={16} />
                      </button>
                    </div>

                    <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center bg-black/0 transition-all duration-300 group-hover:bg-black/40">
                      <span className="rounded-full bg-white/10 px-4 py-2 text-sm font-medium text-white opacity-0 backdrop-blur-sm transition duration-300 group-hover:opacity-100">
                        <FaSearchPlus size={22} />
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      {isPreviewOpen && (
        <ImagePreviewModal
          isOpen={isPreviewOpen}
          imagePublicId={ticket.imagePublicId!}
          onClose={() => setIsPreviewOpen(false)}
        />
      )}
    </main>
  );
}

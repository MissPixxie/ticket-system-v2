"use client";

import { api } from "~/trpc/react";
import ChatBox from "~/app/_components/chatBox";
import { use, useState } from "react";
import { CldImage } from "next-cloudinary";
import { UploadImageButton } from "~/app/_components/cloudinaryUpload/uploadImageButton";
import { EditImageButton } from "~/app/_components/cloudinaryUpload/feEdit";
import { FaSearchPlus, FaTrash } from "react-icons/fa";
import { ImagePreviewModal } from "~/app/_components/modals/imagePreviewModal";
import { formatPriority, formatStatus } from "~/app/utils/formatNotification";

const priorityClasses: Record<string, string> = {
  LOW: "bg-green-500 text-white",
  MEDIUM: "bg-yellow-500 text-black",
  HIGH: "bg-orange-500 text-white",
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
  const [imagePublicId, setImagePublicId] = useState("");
  const [isPreviewOpen, setIsPreviewOpen] = useState<boolean>(false);
  const { data: me } = api.user.me.useQuery();
  const utils = api.useUtils();
  //const { socket } = useSocket();

  const updateTicket = api.ticket.updateTicket.useMutation({
    onSuccess: () => {
      utils.ticket.getTicketById.invalidate();
      utils.ticket.listAllTickets.invalidate();
    },
  });

  if (isLoading || !ticket) {
    return (
      <main className="flex min-h-screen items-center justify-center text-white/70">
        Laddar ticket...
      </main>
    );
  }

  return (
    <main className="min-h-screen px-6 py-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-6 rounded-2xl bg-white/5 p-6 shadow-lg/15 backdrop-blur-lg">
          <div className="flex items-center justify-between">
            <button
              onClick={() => history.back()}
              className="text-sm text-white/60 transition hover:text-white"
            >
              ← Tillbaka
            </button>

            <div className="text-center">
              <h1 className="text-2xl font-bold">{ticket.title}</h1>
              <p className="text-sm text-white/50">{ticket.department}</p>
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
        </div>

        {/* Main layout */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* VÄNSTER - Huvudinnehåll */}
          <div className="flex min-h-150 flex-col gap-6 lg:col-span-2">
            {/* Beskrivning */}
            <div className="rounded-2xl bg-white/5 p-6 shadow-lg/15 backdrop-blur-lg">
              <h2 className="mb-3 text-lg font-semibold">Beskrivning</h2>

              <p className="text-white/80">{ticket.issue}</p>
            </div>

            {/* Chatt */}
            <div className="flex min-h-125 flex-1 flex-col rounded-2xl bg-white/5 p-6 shadow-lg/15 backdrop-blur-lg">
              <h2 className="mb-4 text-lg font-semibold">Meddelanden</h2>

              <div className="flex-1">
                {ticket.conversation?.id && (
                  <ChatBox
                    conversationId={ticket.conversation.id}
                    context="TICKET"
                  />
                )}
              </div>
            </div>
          </div>

          {/* HÖGER - Sidebar */}
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
                  <p className="text-sm text-white/50">Tilldelad</p>
                  <p>{ticket.assignedTo?.name ?? "Ingen"}</p>
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

                <div>
                  <p className="text-sm text-white/50">Status</p>
                  <p>{formatStatus(ticket.status)}</p>
                </div>

                <div>
                  <p className="text-sm text-white/50">Prioritet</p>
                  <p>{formatPriority(ticket.priority)}</p>
                </div>
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

      {/* Image preview */}
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

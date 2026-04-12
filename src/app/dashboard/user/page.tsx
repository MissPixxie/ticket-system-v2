"use client";

import { api } from "~/trpc/react";
import { FaLightbulb, FaTicketAlt } from "react-icons/fa";
import { HiSpeakerphone } from "react-icons/hi";
import { useCreateTicket } from "~/app/_components/modals/create-ticket/useCreateTicket";
import { useState } from "react";
import CreateTicketModal from "~/app/_components/modals/create-ticket/createTicketModal";
import Link from "next/link";
import CampaignList from "~/app/_components/campaignList";

export default function UserHome() {
  const { data: tickets } = api.ticket.listUserTickets.useQuery();
  const { data: suggestions } = api.suggestionBox.listSuggestions.useQuery();
  const { data: news } = api.news.listNews.useQuery({ limit: 5 });
  const [isOpen, setIsOpen] = useState(false);
  const { createTicket, isLoading } = useCreateTicket();
  const [openNewsId, setOpenNewsId] = useState<string | null>(null);
  const [messageInput, setMessageInput] = useState<Record<string, string>>({});

  const openTickets = tickets?.filter((t) => t.status === "OPEN").length ?? 0;

  const inProgress =
    tickets?.filter((t) => t.status === "IN_PROGRESS").length ?? 0;

  const mySuggestions = suggestions?.length ?? 0;

  const campaignNews = news?.filter((n) => n.category === "CAMPAIGN") ?? [];

  const toggleNews = (id: string) => {
    setOpenNewsId((prev) => (prev === id ? null : id));
  };

  const utils = api.useUtils();

  const sendMessage = api.news.addMessage.useMutation({
    onSuccess: async () => {
      await utils.news.listNews.invalidate();
    },
  });

  const handleSendMessage = (id: string) => {
    const content = messageInput[id];

    if (!content?.trim()) return;

    sendMessage.mutate({
      id,
      content,
    });

    setMessageInput((prev) => ({
      ...prev,
      [id]: "",
    }));
  };

  const vote = api.news.voteNews.useMutation({
    onSuccess: async () => {
      await utils.news.listNews.invalidate();
    },
  });

  return (
    <main className="min-h-screen px-6 py-12 text-white">
      <div className="mx-auto max-w-7xl space-y-10">
        {/* HEADER */}

        <div>
          <h1 className="text-2xl font-bold tracking-wide">
            Välkommen tillbaka
          </h1>
          <p className="text-sm text-white/60">
            Här är en översikt över vad som händer i systemet.
          </p>
        </div>
        <CampaignList />

        {/* QUICK ACTIONS */}
        <div>
          <h1 className="text-xl font-semibold tracking-wide text-white">
            Snabblänkar
          </h1>
          <div className="mt-4 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <button onClick={() => setIsOpen(true)} className="card">
              <FaTicketAlt className="mb-3 text-blue-400" size={20} />
              <p className="font-semibold">Skapa ticket</p>
              <p className="text-sm text-white/60">
                Rapportera problem eller fråga support.
              </p>
            </button>

            <Link
              href="/dashboard/user/suggestions"
              className="cursor-pointer rounded-2xl bg-white/5 p-6 text-left shadow-lg/15 backdrop-blur-lg transition hover:bg-white/10"
            >
              <FaLightbulb className="mb-3 text-yellow-400" size={20} />
              <p className="font-semibold">Skicka förslag</p>
              <p className="text-sm text-white/60">
                Dela idéer eller produkter kunder efterfrågar.
              </p>
            </Link>

            <Link
              href="/dashboard/user/news"
              className="cursor-pointer rounded-2xl bg-white/5 p-6 text-left shadow-lg/15 backdrop-blur-lg transition hover:bg-white/10"
            >
              <HiSpeakerphone className="mb-3 text-purple-400" size={20} />
              <p className="font-semibold">Se nyheter</p>
              <p className="text-sm text-white/60">
                Läs senaste uppdateringarna från HQ.
              </p>
            </Link>
          </div>
        </div>

        {/* CONTENT GRID */}

        <div className="grid gap-6 lg:grid-cols-2">
          {/* RECENT TICKETS */}

          <div className="rounded-2xl bg-white/5 p-6 shadow-lg/15 backdrop-blur-lg">
            <h2 className="mb-4 font-semibold">Mina senaste tickets</h2>

            <div className="space-y-3 text-sm">
              {tickets?.slice(0, 5).map((ticket) => (
                <Link
                  key={ticket.id}
                  href={`/dashboard/user/my-tickets/${ticket.id}`}
                  className="flex justify-between rounded-lg bg-white/5 px-3 py-2 transition hover:bg-white/10"
                >
                  <span>{ticket.id}</span>
                  <span>{ticket.title}</span>
                  <span className="text-white/60">{ticket.status}</span>
                </Link>
              ))}

              {!tickets?.length && (
                <p className="text-white/60">Inga tickets ännu</p>
              )}
            </div>
          </div>

          {/* POPULAR SUGGESTIONS */}

          <div className="rounded-2xl bg-white/5 p-6 shadow-lg/15 backdrop-blur-lg">
            <h2 className="mb-4 font-semibold">Populära förslag</h2>

            <div className="space-y-3 text-sm">
              {suggestions?.slice(0, 5).map((suggestion) => (
                <div
                  key={suggestion.id}
                  className="flex justify-between rounded-lg bg-white/5 px-3 py-2"
                >
                  <span>{suggestion.content}</span>

                  <span className="text-white/60">
                    ▲ {suggestion.voteCount}
                  </span>
                </div>
              ))}

              {!suggestions?.length && (
                <p className="text-white/60">Inga förslag ännu</p>
              )}
            </div>
          </div>
        </div>
      </div>
      <CreateTicketModal
        isOpen={isOpen}
        onClose={() => {
          console.log("Closing modal!");
          setIsOpen(false);
        }}
        onSubmit={(data) => {
          createTicket(data);
          setIsOpen(false);
        }}
      />
    </main>
  );
}

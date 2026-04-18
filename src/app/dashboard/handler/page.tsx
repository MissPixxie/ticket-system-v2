"use client";

import { api } from "~/trpc/react";
import { FaLightbulb, FaRegClock } from "react-icons/fa";
import { GoTrophy } from "react-icons/go";
import { RiQuestionLine } from "react-icons/ri";
import Link from "next/link";
import { useState } from "react";

const PAGE_SIZE = 5;

export default function HandlerHome() {
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const { data: tickets, isLoading: ticketsLoading } =
    api.ticket.listAllTickets.useQuery({ limit: 20 });

  const { data: suggestions } = api.suggestionBox.listSuggestions.useQuery();

  const { data: questions = [] } = api.question.listQuestions.useQuery({
    limit: visibleCount,
  });

  const { data: news = [] } = api.news.listNews.useQuery({
    limit: visibleCount,
  });

  return (
    <main className="min-h-screen px-6 py-12 text-white">
      <div className="mx-auto w-full max-w-6xl space-y-10">
        {/* HEADER */}
        <h1 className="text-3xl font-bold tracking-wide">Välkommen, Handler</h1>

        {/* STATS / SNABBÖVERSIKT */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <div className="secondary-card">
            <p className="text-sm text-white/60">Totala tickets</p>
            <p className="mt-2 text-3xl font-bold">
              {tickets?.tickets.length ?? 0}
            </p>
          </div>

          <div className="secondary-card">
            <p className="text-sm text-white/60">Öppna förslag</p>
            <p className="mt-2 text-3xl font-bold">
              {suggestions?.length ?? 0}
            </p>
          </div>

          <div className="secondary-card">
            <p className="text-sm text-white/60">Frågor från butiker</p>
            <p className="mt-2 text-3xl font-bold">{questions?.length ?? 0}</p>
          </div>

          <div className="secondary-card">
            <p className="text-sm text-white/60">Senaste nyheter</p>
            <p className="mt-2 text-3xl font-bold">{news?.length ?? 0}</p>
          </div>
        </div>

        {/* SNABBLÄNKAR / CARDS */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {/* Tickets */}
          <Link
            href={"/dashboard/handler/tickets"}
            className="group rounded-2xl bg-linear-to-b from-[#3b0e7a] to-[#282a53] p-6 text-center shadow-xl/20 transition hover:from-[#4c127f] hover:to-[#343063]"
          >
            <FaRegClock size={36} className="mx-auto mb-4 text-blue-400" />
            <h2 className="mb-2 text-xl font-semibold">Tickets</h2>
            <p className="text-sm text-white/70">Hantera alla tickets</p>
          </Link>

          {/* Suggestions */}
          <Link
            href={"/dashboard/handler/suggestions"}
            className="group rounded-2xl bg-linear-to-b from-[#3b0e7a] to-[#282a53] p-6 text-center shadow-xl/20 transition hover:from-[#4c127f] hover:to-[#343063]"
          >
            <FaLightbulb size={36} className="mx-auto mb-4 text-yellow-400" />
            <h2 className="mb-2 text-xl font-semibold">Förslag</h2>
            <p className="text-sm text-white/70">
              Se och hantera butikernas förslag
            </p>
          </Link>

          {/* Questions */}
          <Link
            href={"/dashboard/handler/questions"}
            className="group rounded-2xl bg-linear-to-b from-[#3b0e7a] to-[#282a53] p-6 text-center shadow-xl/20 transition hover:from-[#4c127f] hover:to-[#343063]"
          >
            <RiQuestionLine size={36} className="mx-auto mb-4 text-green-400" />
            <h2 className="mb-2 text-xl font-semibold">Frågor</h2>
            <p className="text-sm text-white/70">Besvara frågor från butiker</p>
          </Link>

          {/* News */}
          <Link
            href={"/dashboard/handler/news"}
            className="group rounded-2xl bg-linear-to-b from-[#3b0e7a] to-[#282a53] p-6 text-center shadow-xl/20 transition hover:from-[#4c127f] hover:to-[#343063]"
          >
            <GoTrophy size={36} className="mx-auto mb-4 text-red-400" />
            <h2 className="mb-2 text-xl font-semibold">Nyheter</h2>
            <p className="text-sm text-white/70">
              Läs senaste nyheter och information
            </p>
          </Link>
        </div>
      </div>
    </main>
  );
}

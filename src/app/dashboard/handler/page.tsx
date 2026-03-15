"use client";

import { api } from "~/trpc/react";
import { FaLightbulb, FaRegClock } from "react-icons/fa";
import { GoTrophy } from "react-icons/go";
import { RiQuestionLine } from "react-icons/ri";
import { useState } from "react";
import { dummyQuestions } from "~/app/_data/dummyQuestions";
import { dummyNews } from "~/app/_data/dummyNews";

const questions = dummyQuestions;
const news = dummyNews;

export default function HandlerHome() {
  const { data: tickets, isLoading: ticketsLoading } =
    api.ticket.listAllTickets.useQuery();
  const { data: suggestions, isLoading: suggestionsLoading } =
    api.suggestionBox.listSuggestions.useQuery({
      suggestionBoxId: "cmmqzjjn80007k0u9z3586u2k",
    });
  // const { data: questions, isLoading: questionsLoading } =
  //   api.question.listAllQuestions.useQuery();
  // const { data: news, isLoading: newsLoading } = api.news.listNews.useQuery();

  const generalNews = news.filter((n) => n.category === "Nyheter");

  return (
    <main className="min-h-screen px-6 py-12 text-white">
      <div className="mx-auto w-full max-w-6xl space-y-10">
        {/* HEADER */}
        <h1 className="text-3xl font-bold tracking-wide">Välkommen, Handler</h1>

        {/* STATS / SNABBÖVERSIKT */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-2xl bg-white/5 p-6 shadow-lg/10 backdrop-blur-lg transition hover:bg-white/10">
            <p className="text-sm text-white/60">Totala tickets</p>
            <p className="mt-2 text-3xl font-bold">{tickets?.length ?? 0}</p>
          </div>

          <div className="rounded-2xl bg-white/5 p-6 shadow-lg/10 backdrop-blur-lg transition hover:bg-white/10">
            <p className="text-sm text-white/60">Öppna förslag</p>
            <p className="mt-2 text-3xl font-bold">
              {suggestions?.length ?? 0}
            </p>
          </div>

          <div className="rounded-2xl bg-white/5 p-6 shadow-lg/10 backdrop-blur-lg transition hover:bg-white/10">
            <p className="text-sm text-white/60">Frågor från butiker</p>
            <p className="mt-2 text-3xl font-bold">{questions?.length ?? 0}</p>
          </div>

          <div className="rounded-2xl bg-white/5 p-6 shadow-lg/10 backdrop-blur-lg transition hover:bg-white/10">
            <p className="text-sm text-white/60">Senaste nyheter</p>
            <p className="mt-2 text-3xl font-bold">{news?.length ?? 0}</p>
          </div>
        </div>

        {/* SNABBLÄNKAR / CARDS */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {/* Tickets */}
          <div className="group rounded-2xl bg-linear-to-b from-[#3b0e7a] to-[#282a53] p-6 text-center shadow-xl/20 transition hover:from-[#4c127f] hover:to-[#343063]">
            <FaRegClock size={36} className="mx-auto mb-4 text-blue-400" />
            <h2 className="mb-2 text-xl font-semibold">Tickets</h2>
            <p className="text-sm text-white/70">Hantera alla tickets</p>
          </div>

          {/* Suggestions */}
          <div className="group rounded-2xl bg-linear-to-b from-[#3b0e7a] to-[#282a53] p-6 text-center shadow-xl/20 transition hover:from-[#4c127f] hover:to-[#343063]">
            <FaLightbulb size={36} className="mx-auto mb-4 text-yellow-400" />
            <h2 className="mb-2 text-xl font-semibold">Förslag</h2>
            <p className="text-sm text-white/70">
              Se och hantera butikernas förslag
            </p>
          </div>

          {/* Questions */}
          <div className="group rounded-2xl bg-linear-to-b from-[#3b0e7a] to-[#282a53] p-6 text-center shadow-xl/20 transition hover:from-[#4c127f] hover:to-[#343063]">
            <RiQuestionLine size={36} className="mx-auto mb-4 text-green-400" />
            <h2 className="mb-2 text-xl font-semibold">Frågor</h2>
            <p className="text-sm text-white/70">Besvara frågor från butiker</p>
          </div>

          {/* News */}
          <div className="group rounded-2xl bg-linear-to-b from-[#3b0e7a] to-[#282a53] p-6 text-center shadow-xl/20 transition hover:from-[#4c127f] hover:to-[#343063]">
            <GoTrophy size={36} className="mx-auto mb-4 text-red-400" />
            <h2 className="mb-2 text-xl font-semibold">Nyheter</h2>
            <p className="text-sm text-white/70">
              Läs senaste nyheter och information
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}

"use client";

import { useMemo, useState } from "react";
import { api } from "~/trpc/react";
import SuggestionCard from "~/app/_components/cards/suggestionCard";
import { FaRegClock, FaRegLightbulb } from "react-icons/fa6";
import SkeletonSuggestionCard from "~/app/_components/skeletonComponents/cards/skeletonSuggestionCard";
import { AnimatePresence, motion } from "framer-motion";
import { GoDotFill, GoTrophy } from "react-icons/go";
import { RiArrowUpDoubleFill } from "react-icons/ri";
import { FiSearch } from "react-icons/fi";

type FilterType = "latest" | "popular" | "status";

const statusStyles = {
  SENT: "bg-gray-500/20 text-gray-300",
  UNDER_REVIEW: "bg-yellow-500/20 text-yellow-300",
  APPROVED: "bg-blue-500/20 text-blue-300",
  IMPLEMENTED: "bg-green-500/20 text-green-300",
  REJECTED: "bg-red-500/20 text-red-300",
};

export default function SuggestionsHandlerPage() {
  const utils = api.useUtils();

  const [filter, setFilter] = useState<FilterType>("latest");
  const [search, setSearch] = useState("");
  const { data: suggestions = [], isLoading } =
    api.suggestionBox.listSuggestions.useQuery();

  const active = suggestions.filter(
    (s) =>
      !["REJECTED", "IMPLEMENTED", "APPROVED", "UNDER_REVIEW"].includes(
        s.status,
      ),
  );

  const implemented = suggestions.filter((s) => s.status === "IMPLEMENTED");

  const rejected = suggestions.filter((s) => s.status === "REJECTED");

  const approved = suggestions.filter((s) => s.status === "APPROVED");

  const underReview = suggestions.filter((s) => s.status === "UNDER_REVIEW");

  const MotionCard = ({ s }: any) => (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -10, scale: 0.98 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
    >
      <SuggestionCard suggestion={s} />
    </motion.div>
  );

  const visibleSuggestions = useMemo(() => {
    const filtered = suggestions.filter((suggestion) =>
      suggestion.content.toLowerCase().includes(search.toLowerCase()),
    );

    return filtered.sort((a, b) => {
      if (filter === "latest") {
        return (
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      }

      if (filter === "popular") {
        return b.voteCount - a.voteCount;
      }

      const order = {
        SENT: 0,
        UNDER_REVIEW: 1,
        APPROVED: 2,
        IMPLEMENTED: 3,
        REJECTED: 4,
      };

      return order[a.status] - order[b.status];
    });
  }, [suggestions, search, filter]);

  if (isLoading) {
    return (
      <main className="main-page-layout">
        <div className="container text-white">Laddar förslag...</div>
      </main>
    );
  }

  return (
    <main className="main-page-layout">
      <div className="container">
        {/* HEADER */}
        <div className="header-container">
          <FaRegLightbulb className="text-purple-400" size={36} />

          <h1 className="page-header">Förslag från butikerna</h1>
        </div>
        {/* FILTER */}
        <div className="flex justify-between">
          <div className="flex items-end gap-3">
            <button
              onClick={() => setFilter("latest")}
              className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm ${
                filter === "latest"
                  ? "bg-white/20"
                  : "bg-white/5 hover:bg-white/10"
              }`}
            >
              <FaRegClock />
              Senaste
            </button>

            <button
              onClick={() => setFilter("popular")}
              className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm ${
                filter === "popular"
                  ? "bg-white/20"
                  : "bg-white/5 hover:bg-white/10"
              }`}
            >
              <GoTrophy />
              Mest röster
            </button>

            <button
              onClick={() => setFilter("status")}
              className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm ${
                filter === "status"
                  ? "bg-white/20"
                  : "bg-white/5 hover:bg-white/10"
              }`}
            >
              <GoDotFill />
              Status
            </button>
          </div>
          <div className="relative mt-4 w-100">
            <FiSearch
              className="absolute top-1/2 left-4 -translate-y-1/2 text-white/40"
              size={18}
            />

            <input
              type="text"
              placeholder="Sök bland förslag..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-white/5 py-3 pr-4 pl-11 text-white transition-all outline-none placeholder:text-white/40 focus:border-purple-500 focus:bg-white/10"
            />
          </div>
        </div>
        {/* LIST */}
        {isLoading && (
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <SkeletonSuggestionCard key={i} />
            ))}
          </div>
        )}
        <div className="space-y-4">
          {!isLoading && visibleSuggestions?.length === 0 && (
            <p className="text-sm text-white/60">Inga idéer än</p>
          )}

          {visibleSuggestions?.map((suggestion) => (
            <div
              key={suggestion.id}
              className="flex gap-6 rounded-xl bg-white/5 p-4 shadow-lg/15 hover:bg-white/10"
            >
              <div className="flex flex-row place-content-center items-center justify-center">
                <RiArrowUpDoubleFill size={26} className={"text-gray-500"} />

                <span className="text-sm text-white/70">
                  {suggestion.voteCount}
                </span>
              </div>
              {/* CONTENT */}
              <div className="flex-1">
                <p>{suggestion.content}</p>

                <div className="mt-2 text-xs text-white/60">
                  {suggestion.user?.name ?? "Anonym"} ·{" "}
                  {new Date(suggestion.createdAt).toLocaleDateString()}
                </div>
              </div>

              {/* STATUS */}
              <span
                className={`self-start rounded-full px-3 py-1 text-xs ${
                  statusStyles[suggestion.status]
                }`}
              >
                {suggestion.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}

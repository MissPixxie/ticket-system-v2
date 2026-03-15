"use client";

import { useState } from "react";
import { api } from "~/trpc/react";
import { RiArrowUpDoubleFill } from "react-icons/ri";
import { FaLightbulb } from "react-icons/fa";
import { FaRegClock } from "react-icons/fa";
import { GoTrophy } from "react-icons/go";
import { toast } from "sonner";
import { useSocket } from "~/app/socketProvider";

type FilterType = "latest" | "popular" | "status";

const statusStyles = {
  SENT: "bg-gray-500/20 text-gray-300",
  UNDER_REVIEW: "bg-yellow-500/20 text-yellow-300",
  APPROVED: "bg-blue-500/20 text-blue-300",
  IMPLEMENTED: "bg-green-500/20 text-green-300",
  REJECTED: "bg-red-500/20 text-red-300",
};

export default function SuggestionsPage() {
  const suggestionBoxId = "cmmqzjjn80007k0u9z3586u2k";
  const { socket } = useSocket();
  const [filter, setFilter] = useState<FilterType>("latest");
  const [content, setContent] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(false);

  const utils = api.useUtils();

  const { data: suggestions, isLoading } =
    api.suggestionBox.listSuggestions.useQuery({
      suggestionBoxId,
    });

  const vote = api.suggestionBox.voteSuggestion.useMutation({
    onSuccess: async () => {
      await utils.suggestionBox.invalidate();
    },
  });

  const createSuggestion = api.suggestionBox.createSuggestion.useMutation({
    onSuccess: async (suggestion) => {
      toast.success("Idén skickades");

      setContent("");

      await utils.suggestionBox.invalidate();

      if (!socket) return;

      socket.emit("create:room", suggestion.id);
      socket.emit("join:room", suggestion.id);
    },
  });

  const sortedSuggestions = suggestions?.sort((a, b) => {
    if (filter === "latest") {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }

    if (filter === "popular") {
      return b.votes.length - a.votes.length;
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

  return (
    <main className="flex min-h-screen justify-center px-6 py-12 text-white">
      <div className="w-full max-w-5xl rounded-2xl bg-white/5 p-8 backdrop-blur-lg">
        {/* HEADER */}

        <div className="mb-8 flex items-center gap-3">
          <FaLightbulb className="text-yellow-400" size={22} />

          <div>
            <h1 className="text-2xl font-bold tracking-wide">
              Idé & Förbättringsförslag
            </h1>

            <p className="mt-1 text-sm text-white/70">
              Dela idéer, produkter kunder efterfrågar eller förbättringar i
              arbetet. Huvudkontoret kan granska och följa upp dem här.
            </p>
          </div>
        </div>

        {/* CREATE IDEA */}

        <div className="mb-10 rounded-xl bg-white/5 p-4 backdrop-blur">
          <form
            onSubmit={(e) => {
              e.preventDefault();

              if (!content.trim()) {
                toast.error("Skriv en idé först");
                return;
              }

              createSuggestion.mutate({
                content,
                suggestionBoxId,
                isAnonymous,
              });
            }}
            className="flex flex-col gap-3"
          >
            <textarea
              placeholder="Beskriv din idé..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="min-h-22.5 rounded-lg bg-white/10 p-3 text-sm text-white placeholder:text-white/40 focus:outline-none"
            />

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-sm text-white/70">
                <input
                  type="checkbox"
                  checked={isAnonymous}
                  onChange={(e) => setIsAnonymous(e.target.checked)}
                  className="h-4 w-4 cursor-pointer"
                />
                Skicka anonymt
              </label>

              <button
                type="submit"
                className="cursor-pointer rounded-lg bg-blue-600 px-4 py-2 text-sm hover:bg-blue-500"
              >
                Skicka idé
              </button>
            </div>
          </form>
        </div>

        {/* FILTER */}

        <div className="mb-6 flex gap-3">
          <button
            onClick={() => setFilter("latest")}
            className={`flex cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-sm ${
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
            className={`flex cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-sm ${
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
            className={`flex cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-sm ${
              filter === "status"
                ? "bg-white/20"
                : "bg-white/5 hover:bg-white/10"
            }`}
          >
            Status
          </button>
        </div>

        <div className="space-y-4">
          {isLoading && (
            <p className="text-sm text-white/60">Laddar idéer...</p>
          )}

          {!isLoading && sortedSuggestions?.length === 0 && (
            <p className="text-sm text-white/60">Inga idéer än</p>
          )}

          {sortedSuggestions?.map((suggestion) => (
            <div
              key={suggestion.id}
              className="flex items-start gap-4 rounded-xl bg-white/5 p-4 transition hover:bg-white/10"
            >
              <button
                onClick={() => {
                  vote.mutate({ id: suggestion.id, vote: "UP" });

                  if (!socket) return;

                  socket.emit("join:room", suggestion.id);
                  socket.emit("suggestion:voted", suggestion.id);
                }}
              >
                <RiArrowUpDoubleFill
                  size={26}
                  className={
                    suggestion.hasVoted
                      ? "cursor-pointer text-green-600"
                      : "cursor-pointer text-gray-500 hover:text-green-600"
                  }
                />

                <span>{suggestion.votes.length}</span>
              </button>

              <div className="flex-1">
                <p className="text-white">{suggestion.content}</p>

                <div className="mt-2 flex items-center gap-3 text-xs text-white/60">
                  <span>{suggestion.user?.name ?? "Anonym"}</span>

                  <span>
                    {new Date(suggestion.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>

              <span
                className={`rounded-full px-3 py-1 text-xs font-medium ${
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

"use client";

import { useState } from "react";
import { api } from "~/trpc/react";
import { Toast } from "./toast";
import { RiArrowUpDoubleFill } from "react-icons/ri";
import { FaRegClock } from "react-icons/fa";
import { GoTrophy } from "react-icons/go";
import { BsExclamationCircle } from "react-icons/bs";

type FilterType = "latest" | "popular" | "status";

export function SuggestionBox() {
  const id = "cmlnkbw6q0007hcu93wrnr6h3";
  const [filter, setFilter] = useState<FilterType>("latest");
  const {
    data: suggestions,
    isLoading,
    error,
  } = api.suggestionBox.listSuggestions.useQuery({
    suggestionBoxId: id,
  });
  const [issue, setIssue] = useState("");
  const [success, setSuccess] = useState<boolean>();
  const utils = api.useUtils();

  const vote = api.suggestionBox.updateSuggestion.useMutation({
    onSuccess: () => utils.suggestionBox.invalidate(),
  });

  const sortedSuggestions = suggestions?.sort((a, b) => {
    switch (filter) {
      case "latest":
        return (
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      case "popular":
        return b.votes.length - a.votes.length;
      default:
        return 0;
      case "status":
        const statusOrder = {
          SENT: 0,
          UNDER_REVIEW: 1,
          APPROVED: 2,
          REJECTED: 3,
          IMPLEMENTED: 4,
        };
        return statusOrder[a.status] - statusOrder[b.status];
    }
  });

  const createSuggestion = api.suggestionBox.createSuggestion.useMutation({
    onSuccess: async () => {
      setSuccess(true);
      await utils.suggestionBox.invalidate();
      setIssue("");
    },
    onError(error) {
      setSuccess(false);
    },
  });

  return (
    <div className="fixed top-0 left-0 grid h-full w-74 grid-cols-6 bg-linear-to-b from-[#2e026d] to-[#15162c]">
      <div className="item col-span-5 flex h-full flex-col place-content-between bg-linear-to-b from-[#7b6794] to-[#424368]">
        <div className="space-y-4 p-1">
          {isLoading && <p>Laddar förslag...</p>}
          {!sortedSuggestions ||
            (sortedSuggestions.length === 0 && <p>Inga förslag än</p>)}
          {sortedSuggestions &&
            sortedSuggestions.map((suggestion) => (
              <div
                key={suggestion.id}
                className="flex-rowrounded borde flex justify-between bg-white/20 p-4 shadow-md/40"
              >
                <div>
                  <h3>{suggestion.content}</h3>

                  <span className="text-xs text-gray-700">
                    {new Date(suggestion.createdAt).toLocaleString()}
                  </span>
                </div>
                <button
                  onClick={() => vote.mutate({ id: suggestion.id, vote: "UP" })}
                  className="flex items-center gap-1 text-sm"
                >
                  <RiArrowUpDoubleFill
                    size={26}
                    className={
                      suggestion.hasVoted
                        ? "cursor-pointer text-green-600"
                        : "cursor-pointer text-gray-500 hover:text-green-600"
                    }
                  />
                  {""}
                  {suggestion.votes.length}
                </button>
              </div>
            ))}
        </div>
        <div>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              createSuggestion.mutate({ content: issue, suggestionBoxId: id });
            }}
            className="flex flex-col gap-2"
          >
            {success && <Toast data={success} />}
            <textarea
              placeholder="Beskriv ditt förslag"
              value={issue}
              onChange={(e) => setIssue(e.target.value)}
              className="h-full rounded-lg border border-black/50 bg-white/30 p-7 px-4 py-2 text-black required:border-red-500 required:text-red-500"
            />
            <button
              type="submit"
              className="rounded-lg border-2 border-blue-500 px-10 py-3 text-white shadow-md hover:bg-blue-500"
            >
              Submit
            </button>
          </form>
        </div>
      </div>
      <div>
        <button
          className="z-0 flex cursor-pointer flex-row items-center justify-center gap-2 rounded bg-linear-to-b from-[#7b6794]/90 to-[#4c366b] pt-4 pr-1 pb-4 pl-1 shadow-md/50 hover:from-[#9c85b8]/90 hover:to-[#5b447c]/90"
          style={{
            writingMode: "vertical-rl",
            textOrientation: "mixed",
          }}
          onClick={() => setFilter("latest")}
        >
          <p className="text-lg">Senaste</p>
          <FaRegClock />
        </button>
        <button
          className="z-0 flex cursor-pointer flex-row items-center justify-center gap-2 rounded bg-linear-to-b from-[#7b6794]/90 to-[#4c366b] pt-4 pr-1 pb-4 pl-1 shadow-md/50 hover:from-[#9c85b8]/90 hover:to-[#5b447c]/90"
          style={{
            writingMode: "vertical-rl",
            textOrientation: "mixed",
          }}
          onClick={() => setFilter("popular")}
        >
          <p className="text-lg">Mest röster</p>
          <GoTrophy />
        </button>
        <button
          className="z-0 flex cursor-pointer flex-row items-center justify-center gap-2 rounded bg-linear-to-b from-[#7b6794]/90 to-[#4c366b] pt-4 pr-1 pb-4 pl-1 shadow-md/50 hover:from-[#9c85b8]/90 hover:to-[#5b447c]/90"
          style={{
            writingMode: "vertical-rl",
            textOrientation: "mixed",
          }}
          onClick={() => setFilter("status")}
        >
          <p className="text-lg">Status</p>
          <BsExclamationCircle />
        </button>
      </div>
    </div>
  );
}

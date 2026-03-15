"use client";

import { IoHeartSharp } from "react-icons/io5";
import Heart from "./heart";
import { type DummySuggestion } from "~/app/_data/dummySuggestions";

interface SuggestionCardProps {
  suggestion: DummySuggestion;
  expandedId: string | null;
  toggleExpand: (id: string) => void;
  handleStatusChange: (id: string, status: DummySuggestion["status"]) => void;
}

const statusColors: Record<string, string> = {
  SENT: "bg-gray-500 text-white",
  UNDER_REVIEW: "bg-yellow-500 text-black",
  APPROVED: "bg-blue-500 text-white",
  REJECTED: "bg-red-600 text-white",
  IMPLEMENTED: "bg-green-500 text-white",
};

export default function SuggestionCard({
  suggestion,
  expandedId,
  toggleExpand,
  handleStatusChange,
}: SuggestionCardProps) {
  const s = suggestion;

  return (
    <div className="cursor-pointer rounded-2xl bg-white/5 p-6 shadow-lg/15 backdrop-blur-lg transition hover:bg-white/10">
      <div
        className="flex flex-row items-center justify-between"
        onClick={() => toggleExpand(s.id)}
      >
        <div className="flex flex-col gap-1">
          <div className="flex flex-row gap-3">
            <div className="flex items-center gap-1">
              <Heart />
              <span>{s.votes.length}</span>
            </div>
            <h2 className="text-lg font-semibold">{s.content}</h2>
          </div>

          <p className="ml-13 text-sm text-white/60">
            {s.isAnonymous ? "Anonym" : s.user.name} ·{" "}
            {s.createdAt.toLocaleDateString()}
          </p>
        </div>

        <span
          className={`rounded-full px-3 py-1 text-sm font-medium ${statusColors[s.status]}`}
        >
          {s.status.replace("_", " ")}
        </span>
      </div>

      {expandedId === s.id && (
        <div className="mt-5 flex flex-col gap-4 border-t border-white/10 pt-8">
          <div>
            <span className="text-white/70">
              Mer information från användaren..
            </span>
          </div>
          <div className="mt-5 flex items-center gap-3 border-t border-white/10 pt-4">
            <span className="text-sm text-white/70">Ändra status:</span>
            <select
              value={s.status}
              onChange={(e) =>
                handleStatusChange(
                  s.id,
                  e.target.value as DummySuggestion["status"],
                )
              }
              className="cursor-pointer rounded-lg bg-white/10 px-3 py-1 text-sm backdrop-blur-md outline-none hover:bg-white/20"
            >
              <option value="UNDER_REVIEW" className="text-black">
                Under review
              </option>
              <option value="APPROVED" className="text-black">
                Approved
              </option>
              <option value="IMPLEMENTED" className="text-black">
                Implemented
              </option>
              <option value="REJECTED" className="text-black">
                Rejected
              </option>
            </select>
          </div>
        </div>
      )}
    </div>
  );
}

"use client";

import Heart from "../heart";
import { api } from "~/trpc/react";
import type { RouterOutputs } from "~/trpc/react";
import { useState } from "react";

type Suggestion = RouterOutputs["suggestionBox"]["listSuggestions"][number];

interface SuggestionCardProps {
  suggestion: Suggestion;
}

const statusColors: Record<string, string> = {
  SENT: "bg-gray-500 text-white",
  UNDER_REVIEW: "bg-yellow-500 text-black",
  APPROVED: "bg-blue-500 text-white",
  REJECTED: "bg-red-600 text-white",
  IMPLEMENTED: "bg-green-500 text-white",
};

export default function SuggestionCard({ suggestion }: SuggestionCardProps) {
  const utils = api.useUtils();
  const [expandedId, setExpandedId] = useState<string | null>(null);


  const updateSuggestion = api.suggestionBox.updateSuggestionStatus.useMutation(
    {
      onSuccess: (updatedSuggestion) => {
        utils.suggestionBox.listSuggestions.invalidate();
      },
    },
  );

    const handleStatusChange = (newStatus: Suggestion["status"]) => {
      updateSuggestion.mutate({
        id: suggestion.id,
        status: newStatus,
      });
    };

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div className="cursor-pointer rounded-2xl bg-white/5 p-6 shadow-lg/15 backdrop-blur-lg transition hover:bg-white/10">
      <div
        className="flex flex-row items-center justify-between"
        onClick={() => toggleExpand(suggestion.id)}
      >
        <div className="flex flex-col gap-1">
          <div className="flex flex-row gap-3">
            <div className="flex items-center gap-1">
              <Heart />
              <span>{suggestion.voteCount}</span>
            </div>
            <h2 className="text-lg font-semibold">{suggestion.content}</h2>
          </div>

          <p className="ml-13 text-sm text-white/60">
            {suggestion.user && !suggestion.isAnonymous
              ? suggestion.user.name
              : "Anonym"}{" "}
            · {new Date(suggestion.createdAt).toLocaleDateString()}
          </p>
        </div>

        <span
          className={`rounded-full px-3 py-1 text-sm font-medium ${statusColors[suggestion.status]}`}
        >
          {suggestion.status.replace("_", " ")}
        </span>
      </div>

      {expandedId === suggestion.id && (
        <div className="mt-5 flex flex-col gap-4 border-t border-white/10 pt-8">
          <div>
            <span className="text-white/70">
              Mer information från användaren..
            </span>
          </div>
          <div className="mt-5 flex items-center gap-6 border-t border-white/10 pt-4">
            <span className="text-sm text-white/70">Ändra status:</span>

            <div className="flex items-center gap-6">
              {[
                "SENT",
                "UNDER_REVIEW",
                "APPROVED",
                "IMPLEMENTED",
                "REJECTED",
              ].map((status) => (
                <div key={status} className="flex items-center space-x-2">
                  <input
                    type="radio"
                    id={status}
                    name={`status-${suggestion.id}`}
                    checked={suggestion.status === status}
                    onChange={() =>
                      handleStatusChange(status as Suggestion["status"])
                    }
                    className="h-5 w-5 cursor-pointer rounded-full text-blue-500 transition-all duration-200 checked:bg-blue-500 checked:ring-2 checked:ring-blue-700 hover:ring-2 hover:ring-blue-300"
                  />
                  <label
                    htmlFor={status}
                    className="cursor-pointer text-sm font-medium text-white/80 hover:text-blue-500"
                  >
                    {status.replace("_", " ")}
                  </label>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

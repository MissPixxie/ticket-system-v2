"use client";

import { useState } from "react";
import { api } from "~/trpc/react";
import { Toast } from "./toast";
import { RiArrowUpDoubleFill } from "react-icons/ri";

export function SuggestionBox() {
  const id = "cmle07sx30007s8u98lwh4thf";
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
    <div className="item flex h-full flex-col place-content-between">
      <div className="space-y-4">
        {isLoading && <p>Laddar förslag...</p>}
        {!suggestions || (suggestions.length === 0 && <p>Inga förslag än</p>)}
        {suggestions &&
          suggestions.map((suggestion) => (
            <div
              key={suggestion.id}
              className="flex-rowrounded flex border p-4 shadow-sm"
            >
              <div>
                <h3>{suggestion.content}</h3>

                <span className="text-xs text-gray-400">
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
                      ? "text-green-600"
                      : "text-gray-500 hover:text-green-600"
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
            className="h-full rounded-lg border border-black/50 bg-white/10 p-7 px-4 py-2 text-black required:border-red-500 required:text-red-500"
          />
          <button
            type="submit"
            className="rounded-full bg-blue-500 px-10 py-3 text-white"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
}

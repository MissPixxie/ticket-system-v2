"use client";

import { useState } from "react";
import {
  dummySuggestions,
  type DummySuggestion,
} from "~/app/_data/dummySuggestions";
import SuggestionCard from "~/app/_components/cards/suggestionCard";

export default function SuggestionsHandlerPage() {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [suggestions, setSuggestions] =
    useState<DummySuggestion[]>(dummySuggestions);

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const handleStatusChange = (
    suggestionId: string,
    newStatus: DummySuggestion["status"],
  ) => {
    setSuggestions((prev) =>
      prev.map((s) =>
        s.id === suggestionId ? { ...s, status: newStatus } : s,
      ),
    );
  };

  const active = suggestions.filter(
    (s) => !["REJECTED", "IMPLEMENTED"].includes(s.status),
  );
  const implemented = suggestions.filter((s) => s.status === "IMPLEMENTED");
  const rejected = suggestions.filter((s) => s.status === "REJECTED");

  return (
    <main className="min-h-screen px-6 py-12 text-white">
      <h1 className="mb-8 text-2xl font-bold tracking-wide">Förslag</h1>

      {/* Aktiva */}
      <section className="mb-10">
        <h2 className="mb-4 text-sm font-semibold tracking-wide text-white/60 uppercase">
          Aktiva förslag
        </h2>
        <div className="grid gap-6">
          {active.map((s) => (
            <SuggestionCard
              key={s.id}
              suggestion={s}
              expandedId={expandedId}
              toggleExpand={toggleExpand}
              handleStatusChange={handleStatusChange}
            />
          ))}
        </div>
      </section>

      {/* Implementerade */}
      {implemented.length > 0 && (
        <section className="mb-10">
          <h2 className="mb-4 text-sm font-semibold tracking-wide text-white/60 uppercase">
            Implementerade
          </h2>
          <div className="grid gap-6">
            {implemented.map((s) => (
              <SuggestionCard
                key={s.id}
                suggestion={s}
                expandedId={expandedId}
                toggleExpand={toggleExpand}
                handleStatusChange={handleStatusChange}
              />
            ))}
          </div>
        </section>
      )}

      {/* Avslagna */}
      {rejected.length > 0 && (
        <section>
          <h2 className="mb-4 text-sm font-semibold tracking-wide text-white/60 uppercase">
            Avslagna
          </h2>
          <div className="grid gap-6 opacity-70">
            {rejected.map((s) => (
              <SuggestionCard
                key={s.id}
                suggestion={s}
                expandedId={expandedId}
                toggleExpand={toggleExpand}
                handleStatusChange={handleStatusChange}
              />
            ))}
          </div>
        </section>
      )}
    </main>
  );
}

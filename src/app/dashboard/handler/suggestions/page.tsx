"use client";

import { useEffect, useState } from "react";
import SuggestionCard from "~/app/_components/cards/suggestionCard";
import { api } from "~/trpc/react";
import type { RouterOutputs } from "~/trpc/react";
import { FaRegLightbulb } from "react-icons/fa6";

export default function SuggestionsHandlerPage() {
  const utils = api.useUtils();

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

  if (isLoading) {
    return (
      <main className="min-h-screen px-6 py-12 text-white">
        <h1 className="mb-8 text-2xl font-bold tracking-wide">Förslag</h1>
        <div>Laddar förslag...</div>
      </main>
    );
  }

  return (
    <main className="main-page-layout">
      <div className="container">
        <div className="header-container">
          <FaRegLightbulb className="text-purple-400" size={36} />
          <h1 className="page-header">Förslag från butikerna</h1>
        </div>

        {/* Aktiva Förslag */}
        <section className="mb-10">
          <h2 className="mb-4 text-sm font-semibold tracking-wide text-white/60 uppercase">
            Aktiva förslag
          </h2>
          <div className="grid gap-6">
            {active.map((s) => (
              <SuggestionCard key={s.id} suggestion={s} />
            ))}
          </div>
        </section>

        {/* Implementerade Förslag */}
        {implemented.length > 0 && (
          <section className="mb-10">
            <h2 className="mb-4 text-sm font-semibold tracking-wide text-white/60 uppercase">
              Implementerade förslag
            </h2>
            <div className="grid gap-6">
              {implemented.map((s) => (
                <SuggestionCard key={s.id} suggestion={s} />
              ))}
            </div>
          </section>
        )}

        {rejected.length > 0 && (
          <section>
            <h2 className="mb-4 text-sm font-semibold tracking-wide text-white/60 uppercase">
              Avslagna förslag
            </h2>
            <div className="grid gap-6 opacity-70">
              {rejected.map((s) => (
                <SuggestionCard key={s.id} suggestion={s} />
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}

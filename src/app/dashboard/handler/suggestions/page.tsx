"use client";

import { useMemo } from "react";
import { api } from "~/trpc/react";
import SuggestionCard from "~/app/_components/cards/suggestionCard";
import { FaRegLightbulb } from "react-icons/fa6";

import { AnimatePresence, motion } from "framer-motion";

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

        {/* ACTIVE */}
        <section className="mb-10">
          <h2 className="mb-4 text-sm font-semibold tracking-wide text-white/60 uppercase">
            Aktiva förslag
          </h2>

          <AnimatePresence mode="popLayout">
            <div className="grid gap-6">
              {active.map((s) => (
                <MotionCard key={s.id} s={s} />
              ))}
            </div>
          </AnimatePresence>
        </section>

        {/* UNDER REVIEW */}
        {underReview.length > 0 && (
          <section className="mb-10">
            <h2 className="mb-4 text-sm font-semibold tracking-wide text-white/60 uppercase">
              Under granskning
            </h2>

            <AnimatePresence mode="popLayout">
              <div className="grid gap-6">
                {underReview.map((s) => (
                  <MotionCard key={s.id} s={s} />
                ))}
              </div>
            </AnimatePresence>
          </section>
        )}

        {/* APPROVED */}
        {approved.length > 0 && (
          <section className="mb-10">
            <h2 className="mb-4 text-sm font-semibold tracking-wide text-white/60 uppercase">
              Godkända förslag
            </h2>

            <AnimatePresence mode="popLayout">
              <div className="grid gap-6">
                {approved.map((s) => (
                  <MotionCard key={s.id} s={s} />
                ))}
              </div>
            </AnimatePresence>
          </section>
        )}

        {/* IMPLEMENTED */}
        {implemented.length > 0 && (
          <section className="mb-10">
            <h2 className="mb-4 text-sm font-semibold tracking-wide text-white/60 uppercase">
              Implementerade förslag
            </h2>

            <AnimatePresence mode="popLayout">
              <div className="grid gap-6">
                {implemented.map((s) => (
                  <MotionCard key={s.id} s={s} />
                ))}
              </div>
            </AnimatePresence>
          </section>
        )}

        {/* REJECTED */}
        {rejected.length > 0 && (
          <section className="mb-10">
            <h2 className="mb-4 text-sm font-semibold tracking-wide text-white/60 uppercase">
              Avslagna förslag
            </h2>

            <AnimatePresence mode="popLayout">
              <div className="grid gap-6 opacity-70">
                {rejected.map((s) => (
                  <MotionCard key={s.id} s={s} />
                ))}
              </div>
            </AnimatePresence>
          </section>
        )}
      </div>
    </main>
  );
}

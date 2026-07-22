"use client";

import { useState } from "react";
import { HiQuestionMarkCircle } from "react-icons/hi";
import QuestionCard from "~/app/_components/cards/questionCard";
import { api } from "~/trpc/react";
import { FaChevronDown } from "react-icons/fa6";

const PAGE_SIZE = 5;

export default function QuestionPage() {
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [selectedQuestionId, setSelectedQuestionId] = useState<string | null>(
    null,
  );
  const [newMessage, setNewMessage] = useState("");

  const utils = api.useUtils();

  const { data: me } = api.user.me.useQuery();

  const {
    data: questions = [],
    isLoading,
    isFetching,
  } = api.question.listQuestions.useQuery(
    {
      limit: visibleCount,
    },
    {
      placeholderData: (prev) => prev,
    },
  );

  const { data: similarQuestions } = api.question.findSimilarQuestions.useQuery(
    {
      text: newMessage,
    },
    {
      enabled: newMessage.length > 10,
    },
  );

  const createQuestion = api.question.createQuestion.useMutation({
    onSuccess: async () => {
      await utils.question.listQuestions.invalidate();
      setNewMessage("");
    },
  });

  const hasMore = questions.length === visibleCount;

  const toggleQuestions = (id: string) => {
    setSelectedQuestionId((prev) => (prev === id ? null : id));
  };

  const loadMore = () => {
    setVisibleCount((prev) => prev + PAGE_SIZE);
  };

  const showLess = () => {
    setVisibleCount(PAGE_SIZE);
  };

  const handleSend = () => {
    if (!newMessage.trim()) return;

    createQuestion.mutate({
      question: newMessage,
    });

    setNewMessage("");
  };

  if (isLoading) {
    return (
      <main className="flex min-h-screen items-center justify-center text-white/70">
        Laddar frågor...
      </main>
    );
  }

  if (questions.length === 0) {
    return (
      <main className="flex min-h-screen items-center justify-center text-white/70">
        Inga frågor hittades
      </main>
    );
  }

  return (
    <main className="min-h-screen px-6 py-10 text-white">
      <div className="mx-auto max-w-5xl">
        {/* HEADER */}
        <div className="mb-8 flex items-center gap-4">
          <HiQuestionMarkCircle className="text-purple-400" size={26} />

          <div>
            <h1 className="text-3xl font-bold tracking-tight">Frågor & Svar</h1>

            <p className="mt-1 text-sm text-white/50">
              Ställ frågor och ta del av svar från teamet.
            </p>
          </div>
        </div>

        {/* CREATE QUESTION */}
        <div className="mb-8 rounded-3xl border border-white/5 bg-white/5 p-5 shadow-2xl backdrop-blur-xl">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-lg font-semibold">Ny fråga</h2>

            <span className="text-xs text-white/40">
              {newMessage.length}/500
            </span>
          </div>

          <textarea
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Skriv din fråga här..."
            rows={4}
            className="w-full resize-none rounded-2xl border border-white/5 bg-black/20 p-4 text-sm text-white transition outline-none placeholder:text-white/30 focus:border-purple-500/40 focus:ring-2 focus:ring-purple-500/20"
          />
          {similarQuestions && similarQuestions.length > 0 && (
            <div className="rounded-xl bg-purple-500/10 p-4">
              <h3>Liknande frågor hittades</h3>

              {similarQuestions.map((q) => (
                <div key={q.id} className="mt-2">
                  {q.question}
                </div>
              ))}
            </div>
          )}

          <div className="mt-4 flex justify-end">
            <button onClick={handleSend} className="submit-button">
              Skicka fråga
            </button>
          </div>
        </div>

        {/* QUESTIONS */}
        <div className="space-y-4">
          {questions.map((question) => {
            const isOpen = selectedQuestionId === question.id;

            return (
              <div
                key={question.id}
                className="overflow-hidden rounded-3xl border border-white/5 bg-white/5 shadow-xl backdrop-blur-xl transition-all duration-200 hover:bg-white/[0.07]"
              >
                <button
                  onClick={() => toggleQuestions(question.id)}
                  className="w-full p-5 text-left transition"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h2 className="text-base font-semibold text-white">
                        {question.question}
                      </h2>

                      <div className="mt-2 self-start text-xs text-white/40">
                        {question.createdBy?.name
                          ? `${question.createdBy.name} · `
                          : "Anonym · "}
                        {new Date(question.createdAt).toLocaleDateString()}
                      </div>
                    </div>

                    <div
                      className={`mt-1 text-white/40 transition-transform duration-200 ${isOpen ? "rotate-180" : ""} `}
                    >
                      <FaChevronDown size={20} />
                    </div>
                  </div>
                </button>

                {isOpen && (
                  <div className="border-t border-white/5 p-5">
                    <QuestionCard
                      {...question}
                      currentUserId={me?.id ?? null}
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* PAGINATION */}
        <div className="mt-8 flex justify-center gap-3">
          {hasMore && (
            <button
              onClick={loadMore}
              className="rounded-xl border border-white/5 bg-white/5 px-5 py-2 text-sm transition hover:bg-white/10"
            >
              Visa fler
            </button>
          )}

          {visibleCount > PAGE_SIZE && (
            <button
              onClick={showLess}
              className="rounded-xl border border-white/5 bg-white/5 px-5 py-2 text-sm transition hover:bg-white/10"
            >
              Visa mindre
            </button>
          )}
        </div>
        {isFetching && (
          <p className="text-center text-sm text-white/50">
            Laddar fler frågor...
          </p>
        )}
      </div>
    </main>
  );
}

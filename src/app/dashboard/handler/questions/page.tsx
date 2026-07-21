"use client";

import { useState } from "react";
import { api } from "~/trpc/react";
import { HiQuestionMarkCircle } from "react-icons/hi";
import QuestionCard from "~/app/_components/cards/questionCard";
import { FaRegQuestionCircle } from "react-icons/fa";
import { FiSearch } from "react-icons/fi";

const PAGE_SIZE = 5;

export default function QuestionsPage() {
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [selectedQuestionId, setSelectedQuestionId] = useState<string | null>(
    null,
  );
  const [newMessage, setNewMessage] = useState("");
  const [search, setSearch] = useState("");
  const utils = api.useUtils();
  const { data: questions = [], isLoading } =
    api.question.listQuestions.useQuery({
      limit: visibleCount,
    });
  const { data: me } = api.user.me.useQuery();

  const createQuestion = api.question.createQuestion.useMutation({
    onSuccess: () => {
      utils.question.listQuestions.invalidate();
      setNewMessage("");
    },
  });

  const hasMore = questions?.length === visibleCount;

  const toggleQuestions = (id: string) => {
    setSelectedQuestionId((prev) => (prev === id ? null : id));
  };

  const loadMore = () => {
    setVisibleCount((prev) => prev + PAGE_SIZE);
  };

  const showLess = () => {
    setVisibleCount(PAGE_SIZE);
  };

  if (isLoading) {
    return (
      <main className="flex min-h-screen items-center justify-center text-white/70">
        Laddar frågor...
      </main>
    );
  }

  if (!questions || questions.length === 0) {
    return (
      <main className="flex min-h-screen items-center justify-center text-white/70">
        Inga frågor hittades
      </main>
    );
  }

  const filteredQuestions = questions.filter((question) =>
    question.question.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <main className="main-page-layout">
      <div className="container">
        <div className="header-container">
          <FaRegQuestionCircle className="text-purple-400" size={28} />
          <h1 className="page-header">Frågor & Svar</h1>
        </div>

        <div className="relative mt-6">
          <FiSearch
            className="absolute top-1/2 left-4 -translate-y-1/2 text-white/40"
            size={18}
          />

          <input
            type="text"
            placeholder="Sök bland frågor..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-white/10 bg-white/5 py-3 pr-4 pl-11 text-white transition-all outline-none placeholder:text-white/40 focus:border-purple-500 focus:bg-white/10"
          />
        </div>
        <div className="mt-4 space-y-3">
          {filteredQuestions.map((question) => {
            return (
              <div className="card">
                <button
                  className="w-full"
                  onClick={() => {
                    toggleQuestions(question.id);
                  }}
                >
                  <div className="flex flex-col gap-2">
                    <div className="flex-1 self-start">
                      <h2 className="font-medium">{question.question}</h2>
                    </div>
                    <div className="self-start text-xs text-white/40">
                      {question.createdBy?.name
                        ? `${question.createdBy.name} · `
                        : "Anonym · "}
                      {new Date(question.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                </button>
                {selectedQuestionId === question.id && (
                  <div className="p-5">
                    <QuestionCard
                      {...question}
                      currentUserId={me?.id ?? null}
                    />
                  </div>
                )}
              </div>
            );
          })}
          <div className="flex justify-center gap-3">
            {hasMore && (
              <button
                onClick={loadMore}
                className="rounded-lg bg-white/5 px-4 py-2 text-sm hover:bg-white/10"
              >
                Visa fler
              </button>
            )}

            {visibleCount > PAGE_SIZE && (
              <button
                onClick={showLess}
                className="rounded-lg bg-white/5 px-4 py-2 text-sm hover:bg-white/10"
              >
                Visa mindre
              </button>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}

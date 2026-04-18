"use client";

import { useState } from "react";
import { api } from "~/trpc/react";
import { HiQuestionMarkCircle } from "react-icons/hi";
import QuestionCard from "~/app/_components/cards/questionCard";
import { FaRegQuestionCircle } from "react-icons/fa";

const PAGE_SIZE = 5;

export default function QuestionsPage() {
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [selectedQuestionId, setSelectedQuestionId] = useState<string | null>(
    null,
  );
  const [newMessage, setNewMessage] = useState("");
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

  return (
    <main className="main-page-layout">
      <div className="container">
        <div className="header-container">
          <FaRegQuestionCircle className="text-purple-400" size={28} />
          <h1 className="page-header">Frågor & Svar</h1>
        </div>

        <div className="mt-4 space-y-3">
          {questions.map((question) => {
            return (
              <div className="card">
                <button
                  onClick={() => {
                    toggleQuestions(question.id);
                  }}
                >
                  <div className="flex items-center justify-between">
                    <h2 className="font-medium">{question.question}</h2>
                  </div>
                  <div className="mt-2 text-xs text-white/40">
                    {question.createdBy?.name} ·{" "}
                    {new Date(question.createdAt).toLocaleDateString()}
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

"use client";

import { useState } from "react";
import { HiQuestionMarkCircle } from "react-icons/hi";
import QuestionCard from "~/app/_components/cards/questionCard";
import { api } from "~/trpc/react";

const PAGE_SIZE = 5;

export default function QuestionPage() {
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [selectedQuestionId, setSelectedQuestionId] = useState<string | null>(
    null,
  );
  const [newMessage, setNewMessage] = useState("");
  const utils = api.useUtils();
  const { data: me } = api.user.me.useQuery();

  const { data: questions = [] } = api.question.listQuestions.useQuery({
    limit: visibleCount,
  });

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

  const handleSend = () => {
    if (!newMessage) return;

    createQuestion.mutate({ question: newMessage });

    setNewMessage("");
  };

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
          <HiQuestionMarkCircle className="text-purple-400" size={28} />
          <h1 className="page-header">Frågor & Svar</h1>
        </div>

        {/* QUESTION INPUT */}
        <div className="flex gap-2">
          <textarea
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Skriv en fråga..."
            rows={3}
            className="flex-1 resize-none rounded-lg bg-black/30 p-3 text-sm outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button onClick={handleSend} className="submit-button">
            Skicka
          </button>
        </div>

        {/* QUESTIONS */}
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

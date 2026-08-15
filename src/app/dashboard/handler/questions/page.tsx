"use client";

import { useEffect, useRef, useState } from "react";
import { HiQuestionMarkCircle } from "react-icons/hi";
import QuestionCard from "~/app/_components/cards/questionCard";
import SkeletonQuestionCard from "~/app/_components/skeletonComponents/cards/skeletonQuestionCard";
import { api } from "~/trpc/react";
import { FaChevronDown } from "react-icons/fa6";
import { FiSearch } from "react-icons/fi";
import { useSearchParams } from "next/navigation";

const PAGE_SIZE = 5;

export default function QuestionPage() {
  const questionRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [selectedQuestionId, setSelectedQuestionId] = useState<string | null>(
    null,
  );
  const [newMessage, setNewMessage] = useState("");
  const [search, setSearch] = useState("");
  const utils = api.useUtils();
  const searchParams = useSearchParams();

  const questionId = searchParams.get("question");

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

  useEffect(() => {
    if (!questionId) return;

    setSelectedQuestionId(questionId);

    const element = questionRefs.current[questionId];

    if (!element) return;

    element.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });
  }, [questionId, questions]);

  const filteredQuestions = questions.filter((question) =>
    question.question.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <main className="min-h-screen px-6 py-10 text-white">
      <div className="mx-auto max-w-5xl">
        {/* HEADER */}
        <div className="mb-8 flex items-center gap-4">
          <HiQuestionMarkCircle className="text-purple-400" size={26} />

          <div>
            <h1 className="text-3xl font-bold tracking-tight">Frågor & Svar</h1>
          </div>
        </div>

        <div className="relative mt-4 w-100">
          <FiSearch
            className="absolute top-1/2 left-4 -translate-y-1/2 text-white/40"
            size={18}
          />

          <input
            type="text"
            placeholder="Sök bland frågor..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input w-full rounded-xl py-3 pr-4 pl-11"
          />
        </div>

        {/* QUESTIONS */}
        <div className="mt-4 space-y-4">
          {isLoading ? (
            <>
              {Array.from({ length: 5 }).map((_, index) => (
                <SkeletonQuestionCard key={index} />
              ))}
            </>
          ) : questions.length === 0 ? (
            <div className="py-10 text-center text-white/70">
              Inga frågor hittades
            </div>
          ) : (
            <>
              {filteredQuestions.map((question) => {
                const isOpen = selectedQuestionId === question.id;

                return (
                  <div
                    key={question.id}
                    ref={(el) => {
                      questionRefs.current[question.id] = el;
                    }}
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
                          className={`mt-1 text-white/40 transition-transform duration-200 ${
                            isOpen ? "rotate-180" : ""
                          }`}
                        >
                          <FaChevronDown size={20} />
                        </div>
                      </div>
                    </button>

                    {isOpen && (
                      <div className="border-t border-white/5 p-5">
                        <QuestionCard selectedQuestionId={selectedQuestionId} />
                      </div>
                    )}
                  </div>
                );
              })}
              {isFetching && !isLoading && (
                <>
                  <SkeletonQuestionCard />
                  <SkeletonQuestionCard />
                </>
              )}
            </>
          )}
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

"use client";

import { useState } from "react";
import { dummyQuestions, type DummyQuestion } from "~/app/_data/dummyQuestions";

interface Message {
  id: string;
  createdBy: { id: string; name: string };
  content: string;
  createdAt: Date;
}

interface Question {
  id: string;
  title: string;
  content: string;
  createdBy: { id: string; name: string };
  createdAt: Date;
  category: string;
  status: "OPEN" | "ANSWERED" | "CLOSED";
  messages: Message[];
}

export default function QuestionsPage() {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const questions: Question[] = dummyQuestions.map((q) => ({
    ...q,
    messages: q.replies.map((r) => ({
      id: r.id,
      content: r.message,
      createdAt: r.createdAt,
      createdBy: r.createdBy,
    })),
  }));

  return (
    <main className="min-h-screen bg-linear-to-b from-[#2e026d] to-[#15162c] p-6 text-white">
      <h1 className="mb-6 text-3xl font-bold">Frågor från butiker</h1>

      <div className="flex flex-col gap-4">
        {questions.map((q) => (
          <div
            key={q.id}
            className="rounded-lg bg-white/5 p-4 shadow-lg/15 transition hover:bg-white/10"
          >
            <div
              className="flex cursor-pointer justify-between"
              onClick={() => setExpandedId(expandedId === q.id ? null : q.id)}
            >
              <div>
                <h2 className="text-lg font-semibold">{q.title}</h2>
                <p className="text-sm text-white/60">
                  {q.createdBy.name} · {q.createdAt.toLocaleDateString()}
                </p>
              </div>
              <div className="text-sm font-medium">{q.status}</div>
            </div>

            {expandedId === q.id && (
              <div className="mt-4 flex flex-col gap-3 border-t border-white/10 pt-4">
                <p>{q.content}</p>

                {/* Chatbox-liknande område */}
                <div className="flex flex-col gap-2">
                  {q.messages.length === 0 && (
                    <p className="text-sm text-white/60">Inga svar än</p>
                  )}
                  {q.messages.map((msg) => (
                    <div
                      key={msg.id}
                      className="rounded-lg bg-black/20 p-3 text-sm"
                    >
                      <div className="mb-1 text-xs text-white/60">
                        {msg.createdBy.name} ·{" "}
                        {msg.createdAt.toLocaleTimeString()}
                      </div>
                      {msg.content}
                    </div>
                  ))}

                  {/* Nytt svar */}
                  <textarea
                    placeholder="Skriv ett svar..."
                    className="mt-2 w-full rounded-lg bg-black/30 p-3 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button className="mt-1 self-end rounded-lg bg-blue-600 px-4 py-2 text-sm hover:bg-blue-700">
                    Skicka
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </main>
  );
}

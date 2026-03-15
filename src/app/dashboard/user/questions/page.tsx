"use client";

import { useState, useEffect } from "react";
import { HiQuestionMarkCircle } from "react-icons/hi";
import { useSocket } from "~/app/socketProvider";

// Dummy frågor
const dummyQuestions = [
  {
    id: "q1",
    question: "Hur hanterar vi en produktretur som kunden saknar kvitto?",
    askedBy: "Anna, butik Malmö",
    createdAt: new Date("2026-03-10"),
  },
  {
    id: "q2",
    question: "Finns det en standard för exponering av nya produkter?",
    askedBy: "Lina, butik Göteborg",
    createdAt: new Date("2026-03-12"),
  },
];

// Dummy chat-meddelanden per fråga
const dummyMessages: Record<
  string,
  { id: string; user: string; message: string; createdAt: Date }[]
> = {
  q1: [
    {
      id: "m1",
      user: "Anna",
      message: "Hur gör ni i Malmö?",
      createdAt: new Date(),
    },
  ],
  q2: [],
};

export default function QuestionPage() {
  const [expandedQuestionId, setExpandedQuestionId] = useState<string | null>(
    null,
  );
  const [messages, setMessages] = useState(dummyMessages);
  const [newMessage, setNewMessage] = useState("");
  const [currentUser, setCurrentUser] = useState("Du"); // kan ändras till verklig user
  const { socket } = useSocket();

  // Socket: lyssna på nya meddelanden
  useEffect(() => {
    if (!socket) return;

    const handler = (msg: {
      questionId: string;
      user: string;
      message: string;
    }) => {
      setMessages((prev) => ({
        ...prev,
        [msg.questionId]: [
          ...(prev[msg.questionId] || []),
          { ...msg, id: Date.now().toString(), createdAt: new Date() },
        ],
      }));
    };

    socket.on("question:message", handler);
    return () => {
      socket.off("question:message", handler);
    };
  }, [socket]);

  const handleSend = (questionId: string) => {
    if (!newMessage.trim()) return;

    const msgObj = {
      questionId,
      user: currentUser,
      message: newMessage,
    };

    // Skicka via socket
    socket?.emit("question:message", msgObj);

    // Lokalt uppdatera direkt
    setMessages((prev) => ({
      ...prev,
      [questionId]: [
        ...(prev[questionId] || []),
        { ...msgObj, id: Date.now().toString(), createdAt: new Date() },
      ],
    }));

    setNewMessage("");
  };

  return (
    <main className="min-h-screen px-6 py-12 text-white">
      <div className="mx-auto max-w-7xl space-y-8">
        <div className="flex items-center gap-3">
          <HiQuestionMarkCircle className="text-purple-400" size={28} />
          <h1 className="text-2xl font-bold tracking-wide">Frågor & Svar</h1>
        </div>

        <div className="space-y-4">
          {dummyQuestions.map((q) => {
            const isExpanded = expandedQuestionId === q.id;
            const questionMessages = messages[q.id] || [];

            return (
              <div
                key={q.id}
                onClick={() => setExpandedQuestionId(isExpanded ? null : q.id)}
                className="cursor-pointer rounded-2xl bg-white/5 p-6 shadow-lg/15 backdrop-blur-lg transition hover:bg-white/10"
              >
                {/* HEADER */}
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold">{q.question}</h2>
                  <span className="text-sm text-white/60">
                    {new Date(q.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <p className="mt-1 text-xs text-white/50">
                  Frågad av: {q.askedBy}
                </p>

                {/* CHAT */}
                {isExpanded && (
                  <div className="mt-4 flex flex-col gap-3">
                    <div className="flex max-h-64 flex-col-reverse gap-2 overflow-y-auto rounded-lg bg-black/30 p-4">
                      {questionMessages.length === 0 && (
                        <p className="text-sm opacity-60">
                          Inga meddelanden ännu
                        </p>
                      )}

                      {questionMessages
                        .slice()
                        .reverse()
                        .map((msg) => (
                          <div
                            key={msg.id}
                            className={`flex flex-col rounded-lg p-2 text-sm ${
                              msg.user === currentUser
                                ? "ml-auto bg-blue-600 text-white"
                                : "mr-auto bg-white/10 text-white"
                            }`}
                          >
                            <div className="mb-1 text-xs opacity-60">
                              {msg.user} · {msg.createdAt.toLocaleTimeString()}
                            </div>
                            {msg.message}
                          </div>
                        ))}
                    </div>

                    <div
                      onClick={(e) => e.stopPropagation()}
                      className="flex gap-2"
                    >
                      <textarea
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        rows={2}
                        placeholder="Skriv ett meddelande..."
                        className="flex-1 resize-none rounded-lg bg-black/30 p-3 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <button
                        onClick={() => handleSend(q.id)}
                        className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium hover:bg-blue-700"
                      >
                        Skicka
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </main>
  );
}

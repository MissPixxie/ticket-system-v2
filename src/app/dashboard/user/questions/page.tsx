"use client";

import { useState, useEffect } from "react";
import { HiQuestionMarkCircle } from "react-icons/hi";
import ChatBox from "~/app/_components/chatBox";
import { getCurrentUserId } from "~/app/_components/getCurrentUserId";
import type { QuestionWithMessages } from "~/app/constants/questions";
import { useSocket } from "~/app/socketProvider";
import { api } from "~/trpc/react";

export default function QuestionPage() {
  const { data: questions } = api.question.listQuestions.useQuery({
    limit: 5,
  });

  const [expandedQuestion, setExpandedQuestion] =
    useState<QuestionWithMessages | null>(null);

  const [newMessage, setNewMessage] = useState("");
  const [currentUser, setCurrentUser] = useState<string | null>(null);
  const { socket } = useSocket();
  const utils = api.useUtils();

  const { data: messages = [], isLoading } = api.message.listMessages.useQuery({
    id: expandedQuestion?.id ?? "",
    type: "questions",
  });

  const sortedMessages = messages ? [...messages].reverse() : [];

  const createMessage = api.message.createMessage.useMutation({
    onSuccess: () => {
      utils.message.listMessages.invalidate();
      setNewMessage("");
    },
  });

  // useEffect(() => {
  //   const fetchCurrentUser = async () => {
  //     try {
  //       const user = await getCurrentUserId();
  //       setCurrentUser(user);
  //     } catch (error) {
  //       console.error("Fel vid hämtning av användare:", error);
  //     }
  //   };
  //   fetchCurrentUser();
  // }, []);

  useEffect(() => {
    if (!socket) return;

    const handler = (msg: { id: string }) => {
      if (msg.id === expandedQuestion?.id) {
        utils.message.listMessages.invalidate({
          id: expandedQuestion?.id,
          type: "questions",
        });
      }
    };

    socket.on("chat:message", handler);
    return () => {
      socket.off("chat:message", handler);
    };
  }, [socket, expandedQuestion, utils.message.listMessages]);

  const handleSend = () => {
    if (!newMessage.trim()) return;

    if (!expandedQuestion?.id) return;
    createMessage.mutate({
      id: expandedQuestion.id,
      message: newMessage,
      type: "USER_MESSAGE",
    });

    socket?.emit("chat:message", { id: expandedQuestion.id });
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
          {(!questions || questions.length === 0) && (
            <p className="text-sm text-white/60">Inga frågor ännu</p>
          )}

          {/* QUESTION INPUT */}
          <div className="flex gap-2">
            <textarea
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Skriv ett meddelande..."
              rows={3}
              className="flex-1 resize-none rounded-lg bg-black/30 p-3 text-sm outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button onClick={handleSend} className="submit-button">
              Skicka
            </button>
          </div>

          {/* QUESTIONS */}
          {questions &&
            questions.map((question) => {
              return (
                <div
                  key={question.id}
                  onClick={() => setExpandedQuestion(question)}
                  className="cursor-pointer rounded-2xl bg-white/5 p-6 shadow-lg/15 backdrop-blur-lg transition hover:bg-white/10"
                >
                  {/* HEADER */}
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold">
                      {question.content}
                    </h2>
                    <span className="text-sm text-white/60">
                      {new Date(question.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-white/50">
                    Frågad av: {question.createdBy?.name}
                  </p>

                  {/* QUESTIONS CHAT */}

                  <div className="mt-4 flex flex-col gap-3">
                    <div className="flex max-h-64 flex-col-reverse gap-2 overflow-y-auto rounded-lg bg-black/30 p-4">
                      {expandedQuestion?.messages.length === 0 && (
                        <p className="text-sm opacity-60">
                          Inga meddelanden ännu
                        </p>
                      )}

                      {expandedQuestion?.messages
                        .slice()
                        .reverse()
                        .map((msg) => (
                          <div
                            key={msg.id}
                            className={`flex flex-col rounded-lg p-2 text-sm ${
                              msg.createdBy === currentUser
                                ? "ml-auto bg-blue-600 text-white"
                                : "mr-auto bg-white/10 text-white"
                            }`}
                          >
                            <div className="mb-1 text-xs opacity-60">
                              {msg.createdBy?.name} ·{" "}
                              {msg.createdAt.toLocaleTimeString()}
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
                        onClick={() => handleSend()}
                        className="submit-button"
                      >
                        Skicka
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    </main>
  );
}

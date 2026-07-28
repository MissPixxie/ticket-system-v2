"use client";

import { api } from "~/trpc/react";
import { useState } from "react";
import { FaThumbsUp, FaThumbsDown } from "react-icons/fa";
import Link from "next/link";
//import SkeletonCard from "./skeletonComponents/cards/skeletonCampaignCard";

export default function CampaignList() {
  const { data: news, isLoading } = api.news.listNews.useQuery({ limit: 5 });
  const [openNewsId, setOpenNewsId] = useState<string | null>(null);
  const { data: selectedNews } = api.news.getNewsById.useQuery(
    { id: openNewsId! },
    {
      enabled: !!openNewsId,
    },
  );

  const [messageInput, setMessageInput] = useState<Record<string, string>>({});
  const [showAll, setShowAll] = useState(false);
  const utils = api.useUtils();

  const campaignNews = news?.filter((n) => n.category === "CAMPAIGN") ?? [];

  //const visibleCampaignNews = showAll ? campaignNews : campaignNews.slice(0, 2);

  // const toggleNews = (id: string) => {
  //   setOpenNewsId((prev) => (prev === id ? null : id));
  // };

  const sendMessage = api.message.createMessage.useMutation({
    onSuccess: async () => {
      await utils.news.listNews.invalidate();
    },
  });

  const handleSendMessage = (conversationId: string) => {
    const content = messageInput[conversationId];

    if (!content?.trim()) return;
    if (!selectedNews?.conversation?.id) return;

    sendMessage.mutate({
      conversationId: selectedNews?.conversation?.id,
      content,
    });

    setMessageInput((prev) => ({
      ...prev,
      [conversationId]: "",
    }));
  };

  const vote = api.news.voteNews.useMutation({
    onSuccess: async () => {
      await utils.news.listNews.invalidate();
    },
  });

  // if (isLoading) {
  //   return (
  //     <main className="min-h-screen text-white">
  //       <div>
  //         <h1 className="text-xl font-semibold tracking-wide text-white">
  //           Kommande kampanjer
  //         </h1>
  //         <div className="mt-4 space-y-3">
  //           {[...Array(2)].map((_, i) => (
  //             <SkeletonCard key={i} />
  //           ))}
  //         </div>
  //       </div>
  //     </main>
  //   );
  // }

  const conversationId = selectedNews?.conversation?.id;

  return (
    <main className="text-white">
      <div>
        <h1 className="text-xl font-semibold tracking-wide text-white">
          Kommande kampanjer
        </h1>

        <div className="mt-4 space-y-3">
          {news &&
            news.map((news) => {
              return (
                <Link
                  href={`/dashboard/user/news/${news.id}`}
                  key={news.id}
                  // onClick={() => toggleNews(news.id)}
                  className="card"
                >
                  {/* HEADER */}
                  <div className="flex items-center justify-between">
                    <h2 className="font-medium">{news.title}</h2>
                  </div>

                  <p className="mt-1 text-sm text-white/60">{news.content}</p>

                  <div className="mt-2 text-xs text-white/40">
                    {news.createdBy?.name} ·{" "}
                    {new Date(news.createdAt).toLocaleDateString()}
                  </div>
                  {/* VOTE SECTION */}
                  <div className="mt-4 flex items-center gap-3">
                    <span className="text-xs text-white/60">
                      Var den här informationen tydlig?
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        vote.mutate({ id: news.id, type: "UP" });
                      }}
                      className="flex items-center gap-2 rounded-lg bg-white/5 px-3 py-1 hover:bg-white/10"
                    >
                      <FaThumbsUp
                        className={
                          news.userVote === "UP"
                            ? "text-green-400"
                            : "text-white/50"
                        }
                      />

                      <span className="text-sm text-white/70">
                        {news.upVotes ?? 0}
                      </span>
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        vote.mutate({ id: news.id, type: "DOWN" });
                      }}
                      className="flex items-center gap-2 rounded-lg bg-white/5 px-3 py-1 hover:bg-white/10"
                    >
                      <FaThumbsDown
                        className={
                          news.userVote === "DOWN"
                            ? "text-red-500"
                            : "text-white/50"
                        }
                      />
                      <span className="text-sm text-white/70">
                        {news.downVotes ?? 0}
                      </span>
                    </button>
                  </div>
                  {selectedNews && (
                    <div
                      className={`grid overflow-hidden transition-all duration-300 ease-in-out`}
                    >
                      <div className="overflow-hidden">
                        <div className="rounded-xl bg-black/20 p-4 text-sm text-white/70">
                          <p className="mb-2 font-medium text-white">
                            Meddelanden
                          </p>

                          {selectedNews.conversation?.messages?.length ? (
                            selectedNews.conversation.messages.map((msg) => (
                              <div
                                key={msg.id}
                                className="border-b border-white/10 py-2"
                              >
                                <p>{msg.content}</p>
                                <span className="text-xs text-white/40">
                                  {msg.sender?.name ?? "Anonym"}
                                </span>
                              </div>
                            ))
                          ) : (
                            <p className="text-white/40">Inga meddelanden än</p>
                          )}
                        </div>
                        <div className="mt-4 flex gap-2">
                          <input
                            type="text"
                            value={
                              conversationId
                                ? (messageInput[conversationId] ?? "")
                                : ""
                            }
                            onChange={(e) => {
                              if (!conversationId) return;

                              setMessageInput((prev) => ({
                                ...prev,
                                [conversationId]: e.target.value,
                              }));
                            }}
                            placeholder="Skriv ett meddelande..."
                            className="flex-1 rounded-lg bg-white/5 px-3 py-2 text-sm text-white outline-none"
                          />
                          <button
                            onClick={(e) => {
                              e.stopPropagation();

                              if (!selectedNews?.conversation?.id) return;
                              handleSendMessage(selectedNews.conversation.id);
                            }}
                            className="rounded-lg bg-blue-500/20 px-3 py-2 text-sm text-blue-300 hover:bg-blue-500/30"
                          >
                            Skicka
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </Link>
              );
            })}
          {campaignNews.length > 2 && (
            <div className="mt-4 flex justify-center">
              <button
                onClick={() => setShowAll((prev) => !prev)}
                className="rounded-lg bg-white/5 px-4 py-2 text-sm text-white/70 hover:bg-white/10"
              >
                {showAll ? "Visa mindre" : "Visa fler"}
              </button>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

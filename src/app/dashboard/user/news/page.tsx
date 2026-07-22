"use client";

import { api } from "~/trpc/react";
import { useState } from "react";
import { HiSpeakerphone, HiOutlineDocumentText } from "react-icons/hi";
import { MdCampaign } from "react-icons/md";
import SkeletonNewsCard from "~/app/_components/skeletonComponents/cards/skeletonNewsCard";
import { FaThumbsDown, FaThumbsUp } from "react-icons/fa";
import { TfiCommentAlt } from "react-icons/tfi";
import { FiSearch } from "react-icons/fi";

const PAGE_SIZE = 5;

export default function NewsPage() {
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const { data: news = [], isLoading } = api.news.listNews.useQuery({
    limit: visibleCount,
  });
  const [search, setSearch] = useState("");
  const [selectedNewsId, setSelectedNewsId] = useState<string | null>(null);
  const [messageInput, setMessageInput] = useState<Record<string, string>>({});
  const utils = api.useUtils();

  const hasMore = news.length === visibleCount;

  const toggleNews = (id: string) => {
    setSelectedNewsId((prev) => (prev === id ? null : id));
  };

  const loadMore = () => {
    setVisibleCount((prev) => prev + PAGE_SIZE);
  };

  const showLess = () => {
    setVisibleCount(PAGE_SIZE);
  };

  const sendMessage = api.news.addMessage.useMutation({
    onSuccess: async () => {
      await utils.news.listNews.invalidate();
    },
  });

  const handleSendMessage = (id: string) => {
    const content = messageInput[id];

    if (!content?.trim()) return;

    sendMessage.mutate({
      id,
      content,
    });

    setMessageInput((prev) => ({
      ...prev,
      [id]: "",
    }));
  };

  const vote = api.news.voteNews.useMutation({
    onSuccess: async () => {
      await utils.news.listNews.invalidate();
    },
  });

  if (isLoading) {
    return (
      <main className="main-page-layout">
        <div className="container">
          <h1 className="page-header">Laddar nyheter</h1>
          <div className="mt-4 space-y-3">
            {[...Array(5)].map((_, i) => (
              <SkeletonNewsCard key={i} />
            ))}
          </div>
        </div>
      </main>
    );
  }

  if (!news || news.length === 0) {
    return (
      <main className="flex min-h-screen items-center justify-center text-white/70">
        Inga nyheter hittades
      </main>
    );
  }

  const filteredNews = news.filter((n) => {
    const searchText = search.toLowerCase();

    const titleMatch = n.title.toLowerCase().includes(searchText);

    const contentMatch = n.content.toLowerCase().includes(searchText);

    const tagMatch = n.tags?.some((tag) =>
      tag.name.toLowerCase().includes(searchText),
    );

    return titleMatch || contentMatch || tagMatch;
  });

  return (
    <main className="main-page-layout">
      <div className="container">
        <div className="header-container">
          <MdCampaign className="text-purple-400" size={36} />
          <h1 className="page-header">Nyheter</h1>
        </div>
        <div className="relative mt-6">
          <FiSearch
            className="absolute top-1/2 left-4 -translate-y-1/2 text-white/40"
            size={18}
          />

          <input
            type="text"
            placeholder="Sök bland nyheter..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-white/10 bg-white/5 py-3 pr-4 pl-11 text-white transition-all outline-none placeholder:text-white/40 focus:border-purple-500 focus:bg-white/10"
          />
        </div>
        <div className="mt-4 space-y-3">
          {filteredNews.map((news) => {
            const isOpen = selectedNewsId === news.id;

            return (
              <div
                className={`cursor-pointer rounded-2xl p-6 text-left shadow-lg/15 transition-colors duration-200 ${
                  selectedNewsId === news.id
                    ? "bg-white/10"
                    : "bg-white/5 hover:bg-white/10"
                }`}
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
                <div>
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
                  <div className="flex flex-row items-center gap-3">
                    <span className="text-xs text-white/60">
                      Lämna en kommentar
                    </span>
                    <TfiCommentAlt
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleNews(news.id);
                      }}
                    />
                  </div>
                </div>

                <div
                  className={`grid overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? "mt-4 grid-rows-[1fr] opacity-100" : "mt-0 grid-rows-[0fr] opacity-0"} `}
                >
                  <div className="overflow-hidden">
                    <div className="rounded-xl bg-black/20 p-4 text-sm text-white/70">
                      <p className="mb-2 font-medium text-white">Meddelanden</p>

                      {news.comments?.length ? (
                        news.comments.map((msg) => (
                          <div
                            key={msg.id}
                            className="border-b border-white/10 py-2"
                          >
                            <span className="text-xs text-white/40">
                              {msg.user?.name ?? "Anonym"}
                            </span>
                            <p>{msg.content}</p>
                          </div>
                        ))
                      ) : (
                        <p className="text-white/40">Inga meddelanden än</p>
                      )}
                    </div>
                    <div className="mt-4 flex gap-2">
                      <input
                        type="text"
                        value={messageInput[news.id] ?? ""}
                        onChange={(e) => {
                          e.stopPropagation();
                          setMessageInput((prev) => ({
                            ...prev,
                            [news.id]: e.target.value,
                          }));
                        }}
                        placeholder="Skriv ett meddelande..."
                        className="flex-1 rounded-lg bg-white/5 px-3 py-2 text-sm text-white outline-none"
                      />

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSendMessage(news.id);
                        }}
                        className="rounded-lg bg-blue-500/20 px-3 py-2 text-sm text-blue-300 hover:bg-blue-500/30"
                      >
                        Skicka
                      </button>
                    </div>
                  </div>
                </div>
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

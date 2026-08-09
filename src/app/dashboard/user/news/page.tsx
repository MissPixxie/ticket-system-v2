"use client";

import { api } from "~/trpc/react";
import { useState } from "react";
import { FaThumbsUp, FaThumbsDown } from "react-icons/fa";
import Link from "next/link";
import { MdCampaign } from "react-icons/md";
import { FiSearch } from "react-icons/fi";
import SkeletonNewsPage from "~/app/_components/skeletonComponents/pages/skeletonNewsPage";
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
  const [search, setSearch] = useState("");
  const [messageInput, setMessageInput] = useState<Record<string, string>>({});
  const [showAll, setShowAll] = useState(false);
  const utils = api.useUtils();

  const campaignNews = news?.filter((n) => n.category === "CAMPAIGN") ?? [];

  //const visibleCampaignNews = showAll ? campaignNews : campaignNews.slice(0, 2);

  const vote = api.news.voteNews.useMutation({
    onSuccess: async () => {
      await utils.news.listNews.invalidate();
    },
  });

  if (isLoading) {
    return <SkeletonNewsPage />;
  }

  const filteredNews = news?.filter((n) => {
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
      <div>
        <div className="header-container">
          <MdCampaign className="text-purple-400" size={36} />
          <h1 className="page-header">Nyheter & information</h1>
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
            className="input w-full rounded-xl py-3 pr-4 pl-11"
          />
        </div>
        <div className="mt-4 space-y-3">
          {filteredNews &&
            filteredNews.map((news) => {
              return (
                <Link
                  href={`/dashboard/user/news/${news.id}`}
                  key={news.id}
                  className="flex gap-5"
                >
                  <div className="card w-full">
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
                          e.preventDefault();
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
                          e.preventDefault();
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
                  </div>
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

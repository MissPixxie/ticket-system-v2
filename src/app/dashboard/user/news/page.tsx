"use client";

import { api } from "~/trpc/react";
import { useState } from "react";
import { HiSpeakerphone, HiOutlineDocumentText } from "react-icons/hi";
import { MdCampaign } from "react-icons/md";

export default function NewsPage() {
  const { data: news = [], isLoading } = api.news.listNews.useQuery();
  const [selectedNewsId, setSelectedNewsId] = useState<string | null>(null);

  //   if (isLoading) {
  //     return (
  //       <main className="flex min-h-screen items-center justify-center text-white/70">
  //         Laddar nyheter...
  //       </main>
  //     );
  //   }

  //   if (!news || news.length === 0) {
  //     return (
  //       <main className="flex min-h-screen items-center justify-center text-white/70">
  //         Inga nyheter hittades
  //       </main>
  //     );
  //   }

  return (
    <main className="min-h-screen px-6 py-12 text-white">
      <div className="mx-auto max-w-7xl space-y-12">
        {/* NYHETER SEKTION */}
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <MdCampaign className="text-purple-400" size={36} />
            <h1 className="text-2xl font-bold tracking-wide">Nyheter</h1>
          </div>

          <div className="mt-4 space-y-3">
            {news.map((news) => (
              <div
                key={news.id}
                className="rounded-lg bg-white/5 p-4 hover:bg-white/10"
              >
                <div className="flex items-center justify-between">
                  <h2 className="font-medium">{news.title}</h2>
                </div>

                <p className="mt-1 text-sm text-white/60">{news.content}</p>

                <div className="mt-2 text-xs text-white/40">
                  {news.createdBy?.name} ·{" "}
                  {new Date(news.createdAt).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}

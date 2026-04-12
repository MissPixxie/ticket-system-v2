"use client";

import { api } from "~/trpc/react";
import { useEffect, useState } from "react";
import { HiOutlineDocumentText } from "react-icons/hi";
import ResourceCard from "~/app/_components/cards/resourceCard";
import SkeletonResourcesCard from "~/app/_components/skeletonComponents/cards/skeletonResourcesCard";

export default function ResourcesPage() {
  const { data: news, isLoading } = api.news.listNews.useQuery({ limit: 5 });
  const [selectedNewsId, setSelectedNewsId] = useState<string | null>(null);

  const resources = news?.filter((n) => n.category === "STORE_MANUAL") ?? [];

  return (
    <main className="min-h-screen px-6 py-12 text-white">
      <div className="mx-auto max-w-7xl space-y-12">
        {/* RESURSER SEKTION */}
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <HiOutlineDocumentText className="text-purple-400" size={28} />
            <h1 className="text-2xl font-bold tracking-wide">Butiksresurser</h1>
          </div>

          {isLoading && (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {[...Array(5)].map((_, i) => (
                <SkeletonResourcesCard key={i} />
              ))}
            </div>
          )}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {resources.map((item) => (
              <ResourceCard key={item.id} resourceItem={item} />
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}

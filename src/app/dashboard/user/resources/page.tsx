"use client";

import { api } from "~/trpc/react";
import { HiOutlineDocumentText } from "react-icons/hi";
import SkeletonResourcesCard from "~/app/_components/skeletonComponents/cards/skeletonResourcesCard";
import Link from "next/link";
import { FiExternalLink, FiSearch } from "react-icons/fi";
import { useState } from "react";
import { ImBooks } from "react-icons/im";

export default function ResourcesPage() {
  const { data: resources, isLoading } = api.resource.listResources.useQuery({
    limit: 5,
  });
  const [search, setSearch] = useState("");

  const filteredResources = resources?.filter((n) => {
    const searchText = search.toLowerCase();

    const titleMatch = n.title.toLowerCase().includes(searchText);

    const contentMatch = n.description.toLowerCase().includes(searchText);

    const tagMatch = n.tags?.some((tag) =>
      tag.name.toLowerCase().includes(searchText),
    );

    return titleMatch || contentMatch || tagMatch;
  });

  return (
    <main className="main-page-layout">
      <div className="container">
        <div className="space-y-6">
          <div className="header-container">
            <ImBooks className="text-purple-400" size={36} />
            <h1 className="page-header">Resurser & dokumentation</h1>
          </div>
          <div className="relative mt-6">
            <FiSearch
              className="absolute top-1/2 left-4 -translate-y-1/2 text-white/40"
              size={18}
            />

            <input
              type="text"
              placeholder="Sök bland resurser..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input w-full rounded-xl py-3 pr-4 pl-11"
            />
          </div>
          {isLoading && (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {[...Array(5)].map((_, i) => (
                <SkeletonResourcesCard key={i} />
              ))}
            </div>
          )}

          {!isLoading && (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredResources?.map((item) => (
                <div
                  key={item.id}
                  className="rounded-2xl bg-white/5 p-6 shadow-lg/15 transition-colors"
                >
                  <div className="mb-2 flex items-center justify-between">
                    <h3 className="text-xl font-bold">{item.title}</h3>

                    <span className="rounded-full bg-blue-500/20 px-2 py-1 text-xs text-blue-300">
                      {item.category}
                    </span>
                  </div>

                  <p className="mb-2 text-sm text-white/70">
                    {item.createdAt.toLocaleDateString()} ·{" "}
                    {item.createdBy?.name}
                  </p>

                  <p className="line-clamp-3 text-white/80">
                    {item.description}
                  </p>

                  {item.url && (
                    <div className="mt-3 flex items-center gap-1">
                      <Link
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-400 hover:underline"
                      >
                        Läs mer
                      </Link>

                      <FiExternalLink size={12} />
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

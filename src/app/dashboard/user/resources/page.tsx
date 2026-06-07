"use client";

import { api } from "~/trpc/react";
import { HiOutlineDocumentText } from "react-icons/hi";
import SkeletonResourcesCard from "~/app/_components/skeletonComponents/cards/skeletonResourcesCard";
import Link from "next/link";
import { FiExternalLink } from "react-icons/fi";

export default function ResourcesPage() {
  const { data: resources, isLoading } = api.resource.listResources.useQuery({
    limit: 5,
  });

  return (
    <main className="main-page-layout">
      <div className="container">
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <HiOutlineDocumentText className="text-purple-400" size={28} />
            <h1 className="page-header">Butiksresurser</h1>
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
              {resources?.map((item) => (
                <div
                  key={item.id}
                  className="cursor-pointer rounded-2xl bg-white/5 p-6 shadow-lg/15 transition-colors hover:bg-white/10"
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

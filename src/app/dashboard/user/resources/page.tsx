"use client";

import { api } from "~/trpc/react";
import { HiOutlineDocumentText } from "react-icons/hi";
import ResourceCard from "~/app/_components/cards/resourceCard";
import SkeletonResourcesCard from "~/app/_components/skeletonComponents/cards/skeletonResourcesCard";

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
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {resources &&
              resources.map((item) => (
                <ResourceCard key={item.id} resourceItem={item} />
              ))}
          </div>
        </div>
      </div>
    </main>
  );
}

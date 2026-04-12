"use client";

import { api } from "~/trpc/react";
import { useState } from "react";
import { HiOutlineDocumentText } from "react-icons/hi";
import SkeletonResourcesCard from "~/app/_components/skeletonComponents/cards/skeletonResourcesCard";

export default function ResourceCard({
  resourceItem,
}: {
  resourceItem: { id: string; title: string; content: string };
}) {
  return (
    <a
      key={resourceItem.id}
      href="#"
      className="card flex flex-col justify-between"
    >
      <h2 className="text-lg font-semibold">{resourceItem.title}</h2>
      <p className="mt-2 text-sm text-white/70">{resourceItem.content}</p>
    </a>
  );
}

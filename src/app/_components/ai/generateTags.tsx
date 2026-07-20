"use client";

import { api } from "~/trpc/react";

type GenerateTagsButtonProps = {
  text: string;
  onGenerated: (tags: string[]) => void;
};

export function GenerateTagsButton({
  text,
  onGenerated,
}: GenerateTagsButtonProps) {
  const generateTags = api.ai.generateTags.useMutation();

  const handleClick = async () => {
    const result = await generateTags.mutateAsync({ text });

    onGenerated(result.tags);
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={generateTags.isPending || text.trim().length === 0}
      className="rounded-lg bg-purple-600 px-4 py-2 text-white hover:bg-purple-700 disabled:cursor-not-allowed disabled:opacity-50"
    >
      {generateTags.isPending ? "Genererar..." : "Generera taggar"}
    </button>
  );
}

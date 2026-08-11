"use client";

import { FaWandMagicSparkles } from "react-icons/fa6";
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
      className="ai-button"
    >
      <FaWandMagicSparkles size={18} />
      {generateTags.isPending ? "Genererar..." : "Generera taggar"}
    </button>
  );
}

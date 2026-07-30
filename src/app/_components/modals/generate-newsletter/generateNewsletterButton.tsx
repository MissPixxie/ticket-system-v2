"use client";

import { useState } from "react";
import { FaWandMagicSparkles } from "react-icons/fa6";
import GenerateNewsletterModal from "./generateNewsletterModal";
import { api } from "~/trpc/react";
import { useGenerateNewsletter } from "./useGenerateNewsletter";

interface GenerateNewsletterSectionProps {
  conversationId: string;
}

export function GenerateNewsletterButton({
  conversationId,
}: GenerateNewsletterSectionProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [newsletter, setNewsletter] = useState<{
    subject: string;
    body: string;
  } | null>(null);

  const { generateNewsletter, isLoading } = useGenerateNewsletter();

  const handleGenerate = async () => {
    const result = await generateNewsletter({
      conversationId,
    });

    setNewsletter(result.newsletter);
    setIsOpen(true);
  };

  return (
    <>
      <button
        onClick={handleGenerate}
        disabled={isLoading}
        className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-white/80 backdrop-blur-sm transition-all hover:border-white/20 hover:bg-white/10 hover:text-white active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
      >
        <FaWandMagicSparkles size={18} />

        <span>{isLoading ? "Skapar..." : "Generera nyhetsbrev"}</span>
      </button>

      <GenerateNewsletterModal
        open={isOpen}
        newsletter={newsletter}
        onClose={() => setIsOpen(false)}
      />
    </>
  );
}

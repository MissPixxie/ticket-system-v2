"use client";

import { useState } from "react";
import { FaWandMagicSparkles } from "react-icons/fa6";
import GenerateNewsletterModal from "./generateNewsletterModal";
import { useGenerateNewsletter } from "./useGenerateNewsletter";
import { useCreateNewsletter } from "./useCreateNewsletter";
import type { Prisma } from "@prisma/client";

type Newsletter = Pick<
  Prisma.NewsCreateInput,
  "title" | "content" | "category" | "priority"
>;

interface GenerateNewsletterSectionProps {
  conversationId: string;
}

export function GenerateNewsletterButton({
  conversationId,
}: GenerateNewsletterSectionProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [newsletter, setNewsletter] = useState<Newsletter | null>(null);

  const { createNewsletter, isLoading: isCreating } = useCreateNewsletter();
  const { generateNewsletter, isLoading } = useGenerateNewsletter();

  const handleGenerate = async () => {
    const result = await generateNewsletter({
      conversationId,
    });

    console.log("AI result:", result);

    setNewsletter({
      title: result.newsletter.subject,
      content: result.newsletter.body,
      category: "NEWS",
      priority: "LOW",
    });

    setIsOpen(true);
  };

  const handleSendNewsletter = async (newsletter: Newsletter) => {
    await createNewsletter({
      title: newsletter.title,
      content: newsletter.content,
      category: newsletter.category ?? "NEWS",
      priority: newsletter.priority ?? "LOW",
    });

    setIsOpen(false);
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
        onSend={handleSendNewsletter}
      />
    </>
  );
}

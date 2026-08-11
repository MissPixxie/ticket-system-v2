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

    console.log("📰 RESULT FRÅN FRONTEND:", result);
    console.log("📝 TITLE:", result.newsletter.title);
    console.log("📄 CONTENT:", result.newsletter.content);

    setNewsletter({
      title: result.newsletter.title,
      content: result.newsletter.content,
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
        className="ai-button"
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

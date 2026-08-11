"use client";

import { useState } from "react";
import { FaMagic } from "react-icons/fa";

interface TicketReplyAssistantProps {
  onSuggestion: (suggestion: string) => void;
}

export default function TicketReplyAssistant({
  onSuggestion,
}: TicketReplyAssistantProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleSuggest = async () => {
    setIsLoading(true);

    try {
      // Tillfälligt test
      await new Promise((resolve) => setTimeout(resolve, 800));

      const suggestion =
        "Hej! Tack för att du hör av dig. Vi ska undersöka problemet och återkomma så snart vi har mer information.";

      onSuggestion(suggestion);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 p-4">
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-500/20 text-purple-300">
          <FaMagic size={15} />
        </div>

        <div>
          <p className="text-sm font-semibold text-white">AI-assistent</p>

          <p className="text-xs text-white/40">
            Få hjälp att formulera ett svar baserat på tidigare ärenden.
          </p>
        </div>
      </div>

      <button
        type="button"
        onClick={handleSuggest}
        disabled={isLoading}
        className="flex items-center gap-2 rounded-xl bg-purple-500/20 px-4 py-2 text-sm font-medium text-purple-200 transition hover:bg-purple-500/30 disabled:cursor-not-allowed disabled:opacity-50"
      >
        <FaMagic size={13} />

        {isLoading ? "Tänker..." : "Föreslå svar"}
      </button>
    </div>
  );
}

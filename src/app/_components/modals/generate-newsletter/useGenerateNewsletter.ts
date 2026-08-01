"use client";

import { api } from "~/trpc/react";

interface GenerateNewsletterInput {
  conversationId: string;
}

export function useGenerateNewsletter() {
  const mutation = api.ai.generateConversationSummary.useMutation();

  const generateNewsletter = (data: GenerateNewsletterInput) => {
    return mutation.mutateAsync(data);
  };

  return {
    generateNewsletter,
    isLoading: mutation.isPending,
    isError: mutation.isError,
    error: mutation.error,
    isSuccess: mutation.isSuccess,
  };
}

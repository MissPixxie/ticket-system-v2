"use client";

import { api } from "~/trpc/react";

export type Category =
  | "NEWS"
  | "STORE_MANUAL"
  | "PRODUCT_INFORMATION"
  | "CAMPAIGN";

interface EditNewsInput {
  newsId: string;
  title: string;
  content: string;
  category: Category;
}

export function useEditNews() {
  const utils = api.useUtils();

  const mutation = api.news.updateNews.useMutation({
    async onSuccess(news) {
      await utils.news.invalidate();
    },
  });

  const editNews = (data: EditNewsInput) => {
    mutation.mutate(data);
  };

  return {
    editNews,
    isLoading: mutation.isPending,
    isError: mutation.isError,
    error: mutation.error,
    isSuccess: mutation.isSuccess,
  };
}

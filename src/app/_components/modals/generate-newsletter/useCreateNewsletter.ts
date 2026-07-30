import { api } from "~/trpc/react";

export function useCreateNewsletter() {
  const mutation = api.news.createNews.useMutation();

  return {
    createNewsletter: mutation.mutateAsync,
    isLoading: mutation.isPending,
  };
}

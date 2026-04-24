"use client";

import { api } from "~/trpc/react";

export type Category = "DOCUMENTATION" | "TUTORIAL" | "INFORMATION" | "OTHER";

interface EditResourceInput {
  id: string;
  title?: string;
  description?: string;
  category?: Category;
  url?: string;
  isPublished?: boolean;
}

export function useEditResource() {
  const utils = api.useUtils();

  const mutation = api.resource.updateResource.useMutation({
    async onSuccess(resource) {
      await utils.resource.invalidate();
    },
  });

  const editResource = (data: EditResourceInput) => {
    mutation.mutate(data);
  };

  return {
    editResource,
    isLoading: mutation.isPending,
    isError: mutation.isError,
    error: mutation.error,
    isSuccess: mutation.isSuccess,
  };
}

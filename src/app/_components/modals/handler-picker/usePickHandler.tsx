"use client";

import { api } from "~/trpc/react";
import { useSocket } from "~/app/socketProvider";

interface PickHandlerInput {
  userId: string;
  ticketId: string;
}

export function usePickHandler() {
  const utils = api.useUtils();

  const mutation = api.ticket.updateTicket.useMutation({
    async onSuccess() {
      await utils.ticket.invalidate();
    },
  });

  const pickHandler = (data: PickHandlerInput) => {
    mutation.mutate({
      id: data.ticketId,
      assignedToId: data.userId,
    });
  };

  return {
    pickHandler,
    isLoading: mutation.isPending,
    isError: mutation.isError,
    error: mutation.error,
    isSuccess: mutation.isSuccess,
  };
}

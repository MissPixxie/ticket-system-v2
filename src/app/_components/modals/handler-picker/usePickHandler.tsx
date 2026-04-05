"use client";

import { api } from "~/trpc/react";
import { useSocket } from "~/app/socketProvider";

interface PickHandlerInput {
  userId: string;
  ticketId: string;
}

export function usePickHandler() {
  const utils = api.useUtils();
  const { socket } = useSocket();

  const mutation = api.ticket.inviteUserToTicket.useMutation({
    async onSuccess(ticket) {
      await utils.ticket.invalidate();
      socket?.emit("join:room", ticket.id);
    },
  });

  const pickHandler = (data: PickHandlerInput) => {
    // mutation.mutate(data);
  };

  return {
    pickHandler,
    isLoading: mutation.isPending,
    isError: mutation.isError,
    error: mutation.error,
    isSuccess: mutation.isSuccess,
  };
}

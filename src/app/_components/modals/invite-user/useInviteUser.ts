"use client";

import { api } from "~/trpc/react";
import { useSocket } from "~/app/socketProvider";

interface InviteUserInput {
  userId: string;
  ticketId: string;
}

export function useInviteUser() {
  const utils = api.useUtils();
  const { socket } = useSocket();

  const mutation = api.ticket.inviteUserToTicket.useMutation({
    async onSuccess(ticket) {
      await utils.ticket.invalidate();
      socket?.emit("join:room", ticket.id);
    },
  });

  const inviteUser = (data: InviteUserInput) => {
    // mutation.mutate(data);
  };

  return {
    inviteUser,
    isLoading: mutation.isPending,
    isError: mutation.isError,
    error: mutation.error,
    isSuccess: mutation.isSuccess,
  };
}

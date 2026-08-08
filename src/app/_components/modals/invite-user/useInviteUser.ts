"use client";

import { api } from "~/trpc/react";
import { useSocket } from "~/app/socketProvider";
import { toast } from "sonner";

interface InviteUserInput {
  userId: string;
  conversationId: string;
}

export function useInviteUser(ticketId: string) {
  const utils = api.useUtils();
  const { socket } = useSocket();

  const mutation = api.message.inviteUser.useMutation({
    async onSuccess(conversation) {
      if (!conversation) return;

      toast.success("Användaren har bjudits in till konversationen");
      await utils.message.listMessages.invalidate({
        conversationId: conversation.id,
      });

      await utils.ticket.getTicketById.invalidate({
        id: ticketId,
      });

      socket?.emit("join:room", conversation.id);
    },
  });

  const inviteUser = (data: InviteUserInput) => {
    mutation.mutate(data);
  };

  return {
    inviteUser,
    isLoading: mutation.isPending,
    isError: mutation.isError,
    error: mutation.error,
    isSuccess: mutation.isSuccess,
  };
}

"use client";

import { api } from "~/trpc/react";
import { useSocket } from "~/app/socketProvider";

interface InviteUserInput {
  userId: string;
  conversationId: string;
}

export function useInviteUser() {
  const utils = api.useUtils();
  const { socket } = useSocket();

  const mutation = api.message.inviteUser.useMutation({
    async onSuccess(conversation) {
      if (!conversation) return;

      await utils.message.listMessages.invalidate({
        conversationId: conversation.id,
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

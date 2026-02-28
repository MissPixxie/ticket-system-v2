"use client";

import { api } from "~/trpc/react";
import { useSocket } from "~/app/socketProvider";

export type Department = "IT" | "HR" | "CAMPAIGN" | "PRODUCT" | "CUSTOMERCLUB";

interface CreateTicketInput {
  title: string;
  issue: string;
  department: Department;
  isAnonymous?: boolean;
}

export function useCreateTicket() {
  const utils = api.useUtils();
  const { socket } = useSocket();

  const mutation = api.ticket.create.useMutation({
    async onSuccess(ticket) {
      await utils.ticket.invalidate();
      socket?.emit("join:room", ticket.id);
    },
  });

  const createTicket = (data: CreateTicketInput) => {
    mutation.mutate(data);
  };

  return {
    createTicket,
    isLoading: mutation.isPending,
    isError: mutation.isError,
    error: mutation.error,
    isSuccess: mutation.isSuccess,
  };
}

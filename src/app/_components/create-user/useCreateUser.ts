"use client";

import { api } from "~/trpc/react";
import { useSocket } from "~/app/socketProvider";
import type { Department } from "@prisma/client";

interface CreateUserInput {
  name: string;
  email: string;
  password: string;
  roleId: string;
  departments: Department[];
}

export function useCreateUser() {
  const utils = api.useUtils();
  const { socket } = useSocket();

  const mutation = api.user.create.useMutation({
    onSuccess: async (user) => {
      await utils.user.listAll.invalidate();

      socket?.emit("join:room", user.id);
    },
  });

  const createUser = (data: CreateUserInput) => {
    mutation.mutate(data);
  };

  return {
    createUser,
    isLoading: mutation.isPending,
    isError: mutation.isError,
    error: mutation.error,
    isSuccess: mutation.isSuccess,
  };
}

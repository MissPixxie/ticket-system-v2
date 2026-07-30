"use client";

import { api } from "~/trpc/react";
import { useRouter } from "next/navigation";
import { authClient } from "~/server/better-auth/client";

export function SignOutButton() {
  const router = useRouter();
  const utils = api.useUtils();

  async function logout() {
    await authClient.signOut();

    // töm all react-query cache
    utils.invalidate();

    router.push("/");
    router.refresh();
  }

  return (
    <button
      onClick={logout}
      className="cursor-pointer rounded-lg bg-blue-500/20 px-4 py-2 text-lg text-blue-300 hover:bg-blue-500/30"
    >
      Sign out
    </button>
  );
}

"use client";

import { api } from "~/trpc/react";
import { useRouter } from "next/navigation";
import { authClient } from "~/server/better-auth/client";
import { PiSignOut } from "react-icons/pi";

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
      className="submit-button flex items-center justify-center gap-2"
    >
      <PiSignOut size={20} />
      Logga ut
    </button>
  );
}

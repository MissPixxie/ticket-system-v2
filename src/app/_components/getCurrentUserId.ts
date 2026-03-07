import { getSession } from "~/server/better-auth/server";

export async function getCurrentUserId() {
  const session = await getSession();
  return session?.user?.id ?? null;
}

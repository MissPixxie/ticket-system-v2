import { getSession } from "~/server/better-auth/server";
import { db } from "../db";

export default async function getServerSideSession() {
  const session = await getSession();

  if (!session) return null;

  const userWithRole = await db.user.findUnique({
    where: { id: session.user.id },
    include: { role: true },
  });

  if (!userWithRole) return null;

  return {
    ...session,
    user: {
      ...session.user,
      role: userWithRole.role?.name || "USER",
    },
  };
}

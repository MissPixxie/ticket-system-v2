import { getSession } from "~/server/better-auth/server";
import { redirect } from "next/navigation";
import { db } from "~/server/db";

export default async function DashboardIndex() {
  const session = await getSession();

  if (!session) {
    redirect("/");
  }

  const user = await db.user.findUnique({
    where: { id: session.user.id },
    include: { role: true },
  });
  const roleName = user?.role?.name;
  switch (roleName) {
    case "ADMIN":
      redirect("/dashboard/admin");
    case "HANDLER":
      redirect("/dashboard/handler");
    default:
      redirect("/dashboard/user");
  }
}


import { getSession } from "~/server/better-auth/server";
import { redirect } from "next/navigation";

export default async function DashboardIndex() {
  const session = await getSession();

  console.log(session?.user.role)
  if (!session) redirect("/");

  switch (session.user.role) {
    case "ADMIN":
      redirect("/dashboard/admin");
    case "HANDLER":
      redirect("/dashboard/handler");
    default:
      redirect("/dashboard/user");
  }
}

import Link from "next/link";
import { getSession } from "~/server/better-auth/server";
import { HydrateClient } from "~/trpc/server";
import { FaBell } from "react-icons/fa";
import { redirect } from "next/navigation";
import { CreateUser } from "~/app/_components/createUser";
import { ListAllUsers } from "~/app/_components/listAllUsers";
import { db } from "~/server/db";

export default async function Admin() {
  const session = await getSession();

  if (!session) {
    redirect("/");
  }

  const user = await db.user.findUnique({
    where: { id: session.user.id },
    include: { role: true },
  });

  if (!user || user?.role?.name !== "ADMIN") {
    redirect("/");
  }

  const menuItems = [
    { id: "tickets", label: "Tickets" },
    { id: "settings", label: "Inställningar" },
    { id: "employees", label: "Anställda" },
    { id: "logs", label: "Loggar" },
    { id: "createUser", label: "Skapa användare" },
  ];

  return (
    <HydrateClient>
      <main className="flex min-h-screen flex-row flex-wrap bg-linear-to-b from-[#2e026d] to-[#15162c] text-white">
        <div className="flex h-fit w-full grow flex-row place-content-end items-center gap-4">
          <FaBell />
          <p className="text-center text-2xl text-white">
            <span>Logged in as {user?.name}</span>
          </p>
          <Link
            href={"/"}
            className="rounded-full bg-white/10 px-10 py-3 font-semibold no-underline transition hover:bg-white/20"
          >
            Sign out
          </Link>
        </div>
        <div className="flex w-full flex-col place-items-center">
          <h3 className="text-8xl font-bold">Admin Dashboard</h3>
          <ListAllUsers />
          <CreateUser />
          <div className="flex flex-row items-center justify-center gap-10">
            <div className="h-50 w-50 rounded-lg bg-blue-200">
              Totala tickets
            </div>
            <div className="h-50 w-50 rounded-lg bg-green-200">Nya tickets</div>
            <div className="h-50 w-50 rounded-lg bg-amber-200">
              Pågående tickets
            </div>
            <div className="h-50 w-50 rounded bg-red-200">Stängda tickets</div>
          </div>
        </div>
        <aside>
          <div className="fixed top-0 left-0 h-full w-74 bg-linear-to-b from-[#655e6d] to-[#2c2c33]">
            <div className="flex cursor-pointer flex-col items-center">
              {menuItems.map((item) => (
                <div
                  key={item.id}
                  className="flex w-full items-center justify-center pt-5 pb-5 hover:bg-gray-50/5"
                >
                  {item.label}
                </div>
              ))}
            </div>
          </div>
        </aside>
      </main>
    </HydrateClient>
  );
}

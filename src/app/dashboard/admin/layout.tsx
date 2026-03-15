import "~/styles/globals.css";
import Link from "next/link";
import Header from "~/app/_components/header";
import { IoMdHome } from "react-icons/io";
import { TiTicket } from "react-icons/ti";
import { LuLogs } from "react-icons/lu";
import { IoSettingsOutline } from "react-icons/io5";
import { FaUser } from "react-icons/fa";
import { getSession } from "~/server/better-auth/server";
import { db } from "~/server/db";
import { redirect } from "next/navigation";

export default async function AdminLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const session = await getSession();

  if (!session) {
    redirect("/");
  }

  const user = await db.user.findUnique({
    where: { id: session.user.id },
    include: { role: true },
  });

  if (user?.role?.name !== "ADMIN") {
    redirect("/");
  }

  const menuItems = [
    {
      id: "home",
      label: "Hem",
      route: "/dashboard/admin/",
      icon: <IoMdHome />,
    },
    {
      id: "tickets",
      label: "Tickets",
      route: "/dashboard/admin/tickets",
      icon: <TiTicket />,
    },
    {
      id: "users",
      label: "Användare",
      route: "/dashboard/admin/users-list",
      icon: <FaUser />,
    },
    {
      id: "logs",
      label: "Loggar",
      route: "/dashboard/admin/logs",
      icon: <LuLogs />,
    },
    { id: "settings", label: "Inställningar", icon: <IoSettingsOutline /> },
  ];

  return (
    <body>
      <Header />
      <div className="flex flex-row gap-10 bg-linear-to-b from-[#2e026d] to-[#15162c]">
        <aside className="h-screen w-72 border-r border-white/10 bg-white/5 backdrop-blur-xl">
          <div className="flex flex-col pt-6 text-white">
            <div className="mb-6 px-6 text-sm font-semibold tracking-widest text-white/40 uppercase">
              Navigation
            </div>

            {menuItems.map((item) => (
              <Link
                key={item.id}
                href={item.route ?? "#"}
                className="group text-md flex w-full items-center gap-3 px-6 py-4 font-medium transition-all duration-200 hover:bg-white/10"
              >
                {item.icon && (
                  <span className="text-lg text-white/70 transition group-hover:text-white">
                    {item.icon}
                  </span>
                )}

                <span className="transition group-hover:translate-x-1">
                  {item.label}
                </span>
              </Link>
            ))}
          </div>
        </aside>
        <main className="w-full">{children}</main>
      </div>
    </body>
  );
}

import "~/styles/globals.css";
import Link from "next/link";
import Header from "~/app/_components/header";
import { IoMdHome } from "react-icons/io";
import { TiTicket } from "react-icons/ti";
import { LuLogs, LuMessageSquareText } from "react-icons/lu";
import { IoSettingsOutline } from "react-icons/io5";
import { FaRegQuestionCircle } from "react-icons/fa";
import { getSession } from "~/server/better-auth/server";
import { db } from "~/server/db";
import { redirect } from "next/navigation";
import { MdCampaign } from "react-icons/md";
import { FaRegLightbulb } from "react-icons/fa6";
import { ImBooks } from "react-icons/im";

export default async function HandlerLayout({
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

  if (user?.role?.name !== "HANDLER") {
    redirect("/");
  }

  const menuItems = [
    {
      id: "home",
      label: "Hem",
      route: "/dashboard/handler/",
      icon: <IoMdHome size={22} />,
    },
    {
      id: "messages",
      label: "Meddelanden",
      route: "/dashboard/handler/messages",
      icon: <LuMessageSquareText size={20} />,
    },
    {
      id: "tickets",
      label: "Tickets",
      route: "/dashboard/handler/tickets",
      icon: <TiTicket size={20} />,
    },
    {
      id: "questions",
      label: "Frågor",
      route: "/dashboard/handler/questions",
      icon: <FaRegQuestionCircle />,
    },
    {
      id: "news",
      label: "Nyheter",
      route: "/dashboard/handler/news",
      icon: <MdCampaign size={22} />,
    },
    {
      id: "resources",
      label: "Resurser",
      route: "/dashboard/handler/resources",
      icon: <ImBooks size={20} />,
    },
    {
      id: "suggestions",
      label: "Förslag",
      route: "/dashboard/handler/suggestions",
      icon: <FaRegLightbulb />,
    },
    {
      id: "settings",
      label: "Inställningar",
      route: "/dashboard/handler/settings",
      icon: <IoSettingsOutline />,
    },
  ];

  return (
    <div>
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
    </div>
  );
}

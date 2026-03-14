import "~/styles/globals.css";
import Link from "next/link";
import Header from "~/app/_components/header";
import { IoMdHome } from "react-icons/io";
import { TiTicket } from "react-icons/ti";
import { FaUserPlus } from "react-icons/fa6";
import { LuLogs } from "react-icons/lu";
import { IoSettingsOutline } from "react-icons/io5";
import { FaUser } from "react-icons/fa";

export default async function AdminLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
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
    { id: "users", label: "Användare", route: "/dashboard/admin/users-list", icon: <FaUser /> },
    { id: "logs", label: "Loggar", icon: <LuLogs /> },
    {
      id: "createUser",
      label: "Skapa användare",
      route: "/dashboard/admin/create-user",
      icon: <FaUserPlus />,
    },
    { id: "settings", label: "Inställningar", icon: <IoSettingsOutline /> },
  ];

  return (
    <body>
      <Header />
      <div className="flex flex-row gap-10 bg-linear-to-b from-[#2e026d] to-[#15162c]">
        <aside className="h-screen w-74 bg-linear-to-b from-[#655e6d] to-[#2c2c33]">
          <div className="flex cursor-pointer flex-col items-center text-white">
            {menuItems.map((item) => (
              <Link
                key={item.id}
                href={item.route ?? "#"}
                className="flex w-full items-center justify-center pt-5 pb-5 hover:bg-gray-50/5"
              >
                {item.icon && <span className="mr-2">{item.icon}</span>}
                {item.label}
              </Link>
            ))}
          </div>
        </aside>
        <main className="w-full">{children}</main>
      </div>
    </body>
  );
}

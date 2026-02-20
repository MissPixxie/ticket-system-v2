import "~/styles/globals.css";

import { type Metadata } from "next";
import { Geist } from "next/font/google";

import { TRPCReactProvider } from "~/trpc/react";
import { Socket } from "socket.io";
import { SocketProvider } from "./socketProvider";
import { getSession } from "~/server/better-auth/server";

export const metadata: Metadata = {
  title: "Ticket System",
  description:
    "I dislike my workplace bug handling system, therefore I made this. Enjoy!",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const session = await getSession();
  return (
    <html lang="en" className={`${geist.variable}`}>
      <body>
        <TRPCReactProvider>
          <SocketProvider userId={session?.user?.id ?? null}>{children}</SocketProvider>
        </TRPCReactProvider>
      </body>
    </html>
  );
}

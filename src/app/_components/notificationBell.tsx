"use client";

import { useEffect, useRef, useState } from "react";
import { FaBell } from "react-icons/fa";
import { api } from "~/trpc/react";
import { formatNotification } from "../utils/formatNotification";
import Link from "next/link";
import type { Prisma } from "@prisma/client";
import { useSocket } from "../socketProvider";

type NotificationWithEvent = Prisma.NotificationGetPayload<{
  include: {
    event: {
      include: {
        actor: true;
      };
    };
  };
}>;

function getDashboardPrefix(role?: string) {
  switch (role) {
    case "ADMIN":
      return "/dashboard/admin";

    case "HANDLER":
      return "/dashboard/handler";

    default:
      return "/dashboard/user";
  }
}

function getNotificationLink(
  notification: NotificationWithEvent,
  role?: string,
) {
  const dashboard = getDashboardPrefix(role);

  switch (notification.event.originType) {
    case "TICKET":
      return `${dashboard}${
        role === "USER"
          ? `/my-tickets/${notification.event.originId}`
          : `/tickets/${notification.event.originId}`
      }`;

    case "QUESTION":
      return `${dashboard}/questions?question=${notification.event.originId}`;

    case "NEWS":
      return `${dashboard}/news/${notification.event.originId}`;

    case "RESOURCE":
      return `${dashboard}/resources/${notification.event.originId}`;

    case "SUGGESTION":
      return `${dashboard}/suggestions/${notification.event.originId}`;

    default:
      return "#";
  }
}

export const NotificationBell = () => {
  const utils = api.useUtils();
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { socket } = useSocket();
  const { data: unreadCount = 0 } = api.notification.getUnseenCount.useQuery();

  const { data: me } = api.user.me.useQuery();

  const { data: notifications = [], isLoading } =
    api.notification.list.useQuery();

  const markAllAsSeen = api.notification.markAllAsSeen.useMutation({
    onSuccess: () => {
      void utils.notification.list.invalidate();
      void utils.notification.getUnseenCount.invalidate();
    },
  });

  const markAsSeen = api.notification.markAsSeen.useMutation({
    onSuccess: () => {
      void utils.notification.list.invalidate();
      void utils.notification.getUnseenCount.invalidate();
    },
  });

  useEffect(() => {
    if (!socket) {
      console.log("❌ NotificationBell: ingen socket");
      return;
    }

    console.log("🔔 NotificationBell kopplar socket-listener");
    console.log("🔌 Socket ID:", socket.id);
    console.log("🔌 Socket connected:", socket.connected);

    const handleNewNotification = () => {
      console.log("🚨🚨🚨 NY NOTIFICATION VIA SOCKET 🚨🚨🚨");

      void utils.notification.list.invalidate();
      void utils.notification.getUnseenCount.invalidate();
    };

    socket.on("notification:new", handleNewNotification);

    return () => {
      console.log("🔕 NotificationBell tar bort socket-listener");
      socket.off("notification:new", handleNewNotification);
    };
  }, [socket, utils.notification.list, utils.notification.getUnseenCount]);

  const toggleDropdown = () => {
    setOpen((prev) => !prev);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button onClick={toggleDropdown}>
        <FaBell
          size={22}
          className="text-gray-600 transition-colors duration-300 ease-in-out hover:text-gray-300"
        />

        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-[#cc0e0e] text-[12px] font-bold text-white">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 z-50 mt-3 w-105 overflow-hidden rounded-2xl bg-linear-to-b from-[#3b0e7a]/80 to-[#282a53]/80 shadow-2xl backdrop-blur-lg">
          <div className="flex items-center justify-between border-b border-white/10 p-5">
            <div>
              <h3 className="text-lg font-semibold text-white">
                Notifikationer
              </h3>

              <p className="text-sm text-white/40">Senaste aktivitet</p>
            </div>

            {unreadCount > 0 && (
              <span className="rounded-full bg-purple-500/20 px-3 py-1 text-xs font-medium text-purple-300">
                {unreadCount} nya
              </span>
            )}
          </div>

          <div className="max-h-96 space-y-2 overflow-y-auto p-3">
            {isLoading ? (
              <div className="py-8 text-center text-white/50">Laddar...</div>
            ) : notifications.length === 0 ? (
              <div className="py-8 text-center text-white/40">
                Inga notiser ännu.
              </div>
            ) : (
              notifications.map((notification) => (
                <Link
                  key={notification.id}
                  href={getNotificationLink(notification, me?.role?.name)}
                  onClick={() => {
                    if (!notification.seen) {
                      markAsSeen.mutate({ id: notification.id });
                    }
                  }}
                  className={`relative block rounded-xl border p-4 transition-all duration-200 ${
                    notification.seen
                      ? "border-white/5 bg-white/5 hover:bg-white/10"
                      : "border-blue-400/20 bg-blue-500/10 shadow-lg shadow-blue-500/5 hover:border-blue-400/40 hover:bg-blue-500/15"
                  }`}
                >
                  {!notification.seen && (
                    <span className="absolute top-4 right-4 h-2.5 w-2.5 rounded-full bg-blue-400 shadow-lg shadow-blue-500/50" />
                  )}

                  <p
                    className={`pr-5 text-sm ${
                      notification.seen
                        ? "font-medium text-white/70"
                        : "font-semibold text-white"
                    }`}
                  >
                    {formatNotification(notification)}
                  </p>

                  <p className="mt-2 text-xs text-white/40">
                    {new Date(notification.createdAt).toLocaleDateString()} ·{" "}
                    {new Date(notification.createdAt).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </Link>
              ))
            )}
          </div>

          {unreadCount > 0 && (
            <div className="border-t border-white/10 p-3">
              <button
                onClick={() => markAllAsSeen.mutate()}
                className="w-full rounded-xl bg-white/5 py-3 text-sm font-medium text-white transition-all hover:bg-blue-500/10 hover:text-blue-300"
              >
                Markera alla som lästa
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

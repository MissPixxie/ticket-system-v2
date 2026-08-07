"use client";

import { useEffect, useRef, useState } from "react";
import { FaBell } from "react-icons/fa";
import { api } from "~/trpc/react";
import { formatNotification } from "../utils/formatNotification";
import Link from "next/link";
import type { Prisma } from "@prisma/client";

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
  const { originType, originId } = notification.event;

  console.log({
    originType,
    originId,
    role,
  });

  const dashboard = getDashboardPrefix(role);

  switch (originType) {
    case "TICKET":
      switch (role) {
        case "ADMIN":
          return `/dashboard/admin/tickets/${originId}`;

        case "HANDLER":
          return `/dashboard/handler/tickets/${originId}`;

        default:
          return `/dashboard/user/my-tickets/${originId}`;
      }

    case "QUESTION":
      return `${dashboard}/questions/${originId}`;

    case "SUGGESTION":
      return `${dashboard}/suggestions/${originId}`;

    case "NEWS":
      return `${dashboard}/news/${originId}`;

    default:
      return "#";
  }
}

export const NotificationBell = () => {
  const utils = api.useUtils();
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

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

  const toggleDropdown = () => {
    const willOpen = !open;
    setOpen(willOpen);

    if (willOpen && unreadCount > 0) {
      markAllAsSeen.mutate();
    }
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
        <div className="absolute right-0 z-50 mt-3 w-80 overflow-hidden rounded-xl border border-gray-200 bg-white text-black shadow-xl">
          <div className="flex items-center justify-between border-b p-4">
            <h3 className="font-semibold">Notifikationer</h3>
            {unreadCount > 0 && (
              <span className="text-xs text-gray-500">{unreadCount} nya</span>
            )}
          </div>

          <div className="max-h-80 overflow-y-auto">
            {isLoading ? (
              <div className="p-4 text-center text-sm text-gray-500">
                Laddar...
              </div>
            ) : notifications?.length === 0 ? (
              <div className="p-8 text-center text-sm text-gray-400">
                Inga notiser just nu.
              </div>
            ) : (
              notifications.map((notification) => (
                <Link
                  key={notification.id}
                  href={getNotificationLink(notification, me?.role?.name)}
                  className={`block border-b p-4 transition hover:bg-gray-50 ${
                    !notification.seen ? "bg-blue-50/50" : ""
                  }`}
                >
                  <p className="text-sm text-gray-800">
                    {formatNotification(notification)}
                  </p>

                  <span className="mt-1 block text-[10px] text-gray-400">
                    {new Date(notification.createdAt).toLocaleString()}
                  </span>
                </Link>
              ))
            )}
          </div>

          <button
            onClick={() => markAllAsSeen.mutate()}
            className="w-full bg-gray-50 p-3 text-center text-sm font-medium text-blue-600 transition hover:bg-gray-100"
          >
            Markera alla som lästa
          </button>
        </div>
      )}
    </div>
  );
};

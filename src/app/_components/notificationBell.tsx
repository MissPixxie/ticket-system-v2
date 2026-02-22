"use client";

import { useEffect, useRef, useState } from "react";
import { FaBell } from "react-icons/fa";
import { api } from "~/trpc/react";

interface NotificationBellProps {
  userId: string;
}

export const NotificationBell = ({ userId }: NotificationBellProps) => {
  const utils = api.useUtils();
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const { data: unreadCount = 0 } = api.notification.getUnseenCount.useQuery();

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
      <button
        onClick={toggleDropdown}
        className="relative rounded-full p-2 transition hover:bg-gray-100"
      >
        <FaBell size={22} className="text-gray-600" />

        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white ring-2 ring-white">
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
                <div
                  key={notification.id}
                  className={`border-b p-4 transition hover:bg-gray-50 ${
                    !notification.seen ? "bg-blue-50/50" : ""
                  }`}
                >
                  <p className="text-sm text-gray-800">{notification.text}</p>
                  <span className="mt-1 block text-[10px] text-gray-400">
                    {new Date(notification.createdAt).toLocaleString()}
                  </span>
                </div>
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

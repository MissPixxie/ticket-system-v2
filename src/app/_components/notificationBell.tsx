"use client";

import { useEffect, useState } from "react";
import { FaBell } from "react-icons/fa";
import { useSocket } from "../socketProvider";
import { useNotification } from "../hooks/useNotification";

export function NotificationBell({ userId }: { userId: string }) {
  const notifications = useNotification(
    "notification",
    "You have a new notification!",
    userId,
  );

  return (
    <div className="relative">
      {/* {notifications.length > 0 && ( */}
      <div className="absolute -top-2 -right-2 flex h-5 w-5 animate-pulse items-center justify-center rounded-full bg-red-500 text-xs text-white">
        {/* {notifications.length} */}
      </div>
      {/* )} */}
      <FaBell size={22} />
    </div>
  );
}

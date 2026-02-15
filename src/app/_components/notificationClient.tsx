"use client";

import { useEffect, useState } from "react";
import { FaBell } from "react-icons/fa";
import { useSocket } from "../socketProvider";

export function NotificationClient({ userId }: { userId: string }) {
  const { socket } = useSocket();
  const [notifications, setNotifications] = useState<string[]>([]);

  useEffect(() => {
    if (!socket) return;

    const handler = (msg: { userId: string; text: string }) => {
      if (msg.userId === userId) {
        setNotifications((prev) => [...prev, msg.text]);
      }
    };

    socket.on("notification", handler);

    return () => {
      socket.off("notification", handler);
    };
  }, [socket, userId]);

  return (
    <div className="relative">
      {notifications.length > 0 ? (
        <div className="absolute -top-2 -right-2 flex h-5 w-5 animate-pulse items-center justify-center rounded-full bg-red-500 text-xs text-white">
          {notifications.length}
        </div>
      ) : null}
      <FaBell size={22} />
    </div>
  );
}

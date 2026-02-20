"use client";

import { useEffect, useState } from "react";
import { FaBell } from "react-icons/fa";
import { useSocket } from "../socketProvider";

type NotificationType = "message" | "ticket" | "suggestion" | "notification";

export function useNotification(
  notificationType: NotificationType,
  userId?: string,
) {
  const { socket } = useSocket();
  const [notifications, setNotifications] = useState<string[]>([]);

  useEffect(() => {
    if (!socket) return;

    const handler = (msg: { userId: string; text: string }) => {
      if (msg.userId === userId) {
        setNotifications((prev) => [...prev, msg.text]);
      }
    };

    socket.on(notificationType, handler);

    return () => {
      socket.off(notificationType, handler);
    };
  }, [socket]);

  const clearNotifications = () => setNotifications([]);

  return { notifications, clearNotifications };
}

"use client";

import { useEffect, useState } from "react";
import { FaBell } from "react-icons/fa";
import { useSocket } from "../socketProvider";


export function useNotification() {
  const { socket } = useSocket();
  const [notifications, setNotifications] = useState<string[]>([]);

  useEffect(() => {
    if (!socket) return;

    const handler = (msg: string) => {
      setNotifications((prev) => [...prev, msg]);
    };

    socket.on("notification", handler);

    return () => {
      socket.off("notification", handler);
    };
  }, [socket]);

  const clearNotifications = () => setNotifications([]);

  return { notifications, clearNotifications };
}

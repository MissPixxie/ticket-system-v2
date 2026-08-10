"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

interface SocketContextValue {
  socket: Socket | null;
  isConnected: boolean;
}

const SocketContext = createContext<SocketContextValue>({
  socket: null,
  isConnected: false,
});

export const SocketProvider = ({
  children,
  userId,
}: {
  children: React.ReactNode;
  userId: string | null;
}) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (!userId) return;

    const socketInstance = io(
      "https://victorious-freedom-production-8887.up.railway.app",
      {
        query: { userId },
        transports: ["websocket"],
      },
    );

    socketInstance.on("connect", () => {
      console.log("🟢 Connected to socket:", socketInstance.id);
      setIsConnected(true);
    });

    socketInstance.on("notification:new", () => {
      console.log("🚨🚨 SOCKET PROVIDER FICK NOTIFICATION 🚨🚨");
    });

    socketInstance.on("connect_error", (error) => {
      console.error("🔴 Socket connection error:", error);
    });

    socketInstance.on("disconnect", (reason) => {
      console.log("🟡 Socket disconnected:", reason);
      setIsConnected(false);
    });

    setSocket(socketInstance);

    return () => {
      socketInstance.disconnect();
      setSocket(null);
    };
  }, [userId]);

  return (
    <SocketContext.Provider value={{ socket, isConnected }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);

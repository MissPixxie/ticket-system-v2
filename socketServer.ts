import { createServer } from "http";
import { Server } from "socket.io";
import "dotenv/config";

const PORT = Number(process.env.PORT) || 3001;

const httpServer = createServer();

const io = new Server(httpServer, {
  cors: {
    origin: "https://ticket-system-v2-production.up.railway.app",
  },
});

io.on("connection", (socket) => {
  const userId = socket.handshake.query.userId as string;

  console.log(`🟢 User connected: ${userId}`);

  // Personligt room för notifikationer
  socket.join(`user:${userId}`);

  console.log(`🔔 ${userId} gick med i user:${userId}`);

  socket.on("disconnect", (reason) => {
    console.log(`🔴 User disconnected: ${userId} - ${reason}`);
  });
});

httpServer.listen(PORT, () => {
  console.log(`Socket.IO server running on port ${PORT}`);
});

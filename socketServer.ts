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

  socket.on("join:room", (roomId) => {
    const room = io.sockets.adapter.rooms.get(roomId);
    const isCreator = !room || room.size === 0;

    socket.join(roomId);

    if (isCreator) {
      console.log(`${userId} skapade och gick med i ${roomId}`);
    } else {
      console.log(`${userId} gick med i befintligt rum ${roomId}`);
    }

    socket.to(roomId).emit("notification", `User ${userId} has joined`);
  });

  socket.on("disconnect", () => {
    console.log(`User disconnected: ${userId}`);
  });
});

httpServer.listen(PORT, () => {
  console.log(`Socket.IO server running on port ${PORT}`);
});

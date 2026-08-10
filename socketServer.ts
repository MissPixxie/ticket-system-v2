import { createServer } from "http";
import { Server } from "socket.io";
import { db } from "~/server/db";
import "dotenv/config";

const PORT = Number(process.env.PORT) || 3001;
const httpServer = createServer();
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:3000",
  },
});

io.on("connection", (socket) => {
  const userId = socket.handshake.query.userId as string;

  socket.on("join:room", (roomId) => {
    const room = io.sockets.adapter.rooms.get(roomId);
    const isCreator = !room || room.size === 0; // Om rummet inte finns är du skaparen

    socket.join(roomId);

    if (isCreator) {
      console.log(`${userId} skapade och gick med i ${roomId}`);
    } else {
      console.log(`${userId} gick med i befintligt rum ${roomId}`);
    }

    // Meddela andra i rummet
    socket.to(roomId).emit("notification", `User ${userId} has joined`);
  });

  socket.on("disconnect", () => {
    console.log(`User disconnected: ${userId}`);
  });
});

httpServer.listen(PORT, () => {
  console.log(`Socket.IO server running on http://localhost:${PORT}`);
});

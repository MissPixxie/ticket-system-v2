import { createServer } from "http";
import { Server } from "socket.io";
import { db } from "~/server/db";
import "dotenv/config";

const httpServer = createServer();
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:3000",
  },
});

io.on("connection", (socket) => {
  const userId = socket.handshake.query.userId as string;

  socket.on("create:room", (roomId) => {
    socket.join(roomId);
    console.log(`${socket.id} gick med i ${roomId}`);
  });

  socket.on("join:room", (roomId) => {
    socket.join(roomId);
    console.log(`${socket.id} gick med i ${roomId}`);
    socket
      .to(roomId)
      .emit("notification", `User ${userId} has joined the room ${roomId}`);
  });

  socket.on("disconnect", () => {
    console.log(`User disconnected: ${userId}`);
  });
});

httpServer.listen(3001, () => {
  console.log("Socket.IO server running on http://localhost:3001");
});

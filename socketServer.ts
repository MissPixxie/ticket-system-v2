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

httpServer.on("request", (req, res) => {
  if (req.method === "POST" && req.url === "/notify") {
    const secret = req.headers["x-internal-secret"];

    if (secret !== process.env.INTERNAL_SOCKET_SECRET) {
      res.writeHead(401);
      res.end("Unauthorized");
      return;
    }

    let body = "";

    req.on("data", (chunk) => {
      body += chunk;
    });

    req.on("end", () => {
      try {
        const { userId } = JSON.parse(body);
        if (!userId || typeof userId !== "string") {
          res.writeHead(400);
          res.end("Invalid userId");
          return;
        }

        const roomName = `user:${userId}`;
        const room = io.sockets.adapter.rooms.get(roomName);

        console.log("🔔 /notify mottagen för user:", userId);
        console.log("👥 Socketar i user-room:", roomName, room?.size ?? 0);

        io.to(roomName).emit("notification:new");

        res.writeHead(200, {
          "Content-Type": "application/json",
        });

        res.end(JSON.stringify({ success: true }));
      } catch {
        res.writeHead(400);
        res.end("Invalid JSON");
      }
    });

    return;
  }

  res.writeHead(404);
  res.end("Not found");
});

io.on("connection", (socket) => {
  const userId = socket.handshake.query.userId as string;

  // Varje användare får ett eget room för personliga notiser
  const userRoom = `user:${userId}`;

  socket.join(userRoom);

  console.log(`👤 ${userId} gick med i sitt user-room`);
  console.log(`👤 Socket ID: ${socket.id}`);
  console.log(`👤 User room: ${userRoom}`);

  socket.on("join:room", (roomId) => {
    console.log(`📥 ${userId} försöker gå med i room: ${roomId}`);

    const room = io.sockets.adapter.rooms.get(roomId);
    const isCreator = !room || room.size === 0;

    socket.join(roomId);

    if (isCreator) {
      console.log(`🟢 ${userId} skapade och gick med i ${roomId}`);
    } else {
      console.log(`🟡 ${userId} gick med i befintligt rum ${roomId}`);
    }
  });

  socket.on("chat:message", ({ conversationId }) => {
    console.log(`💬 Nytt meddelande i conversation: ${conversationId}`);

    socket.to(conversationId).emit("chat:message", {
      conversationId,
    });
  });

  socket.on("disconnect", (reason) => {
    console.log(`🟡 User disconnected: ${userId}`, reason);
  });
});

httpServer.listen(PORT, () => {
  console.log(`Socket.IO server running on port ${PORT}`);
});

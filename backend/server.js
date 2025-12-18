import express from "express";
import http from "http";
import { Server as SocketServer } from "socket.io";
import cors from "cors";

const app = express();
const server = http.createServer(app);
const io = new SocketServer(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.get("/", (req, res) => {
  res.json({ message: "JHC Broadcast Server is running" });
});

app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    connectedClients: io.engine.clientsCount,
    timestamp: new Date().toISOString(),
  });
});

// Socket.io connection handling
io.on("connection", (socket) => {
  console.log(`✅ Client connected: ${socket.id}`);
  console.log(`📊 Total connected clients: ${io.engine.clientsCount}`);

  // Broadcast announcement (Pengumuman Langsung - Kirim)
  socket.on("broadcast-announcement", (data) => {
    console.log(`🔊 Broadcasting announcement from ${socket.id}`);
    console.log(
      `   Audio URL length: ${data.audioUrl ? data.audioUrl.length : 0} chars`
    );
    console.log(`   Duration: ${data.duration}s`);

    // Emit to all connected clients including sender
    io.emit("play-announcement", {
      audioUrl: data.audioUrl,
      duration: data.duration,
      broadcastAt: new Date().toISOString(),
    });

    console.log(
      `📢 Announcement broadcast to all ${io.engine.clientsCount} clients`
    );
  });

  // Broadcast code alert (Panggilan Code)
  socket.on("broadcast-code", (data) => {
    console.log(`🚨 Broadcasting code: ${data.codeName} from ${socket.id}`);

    // Emit to all connected clients including sender
    io.emit("play-code", {
      codeName: data.codeName,
      location: data.location || null,
      broadcastAt: new Date().toISOString(),
    });

    console.log(
      `🎵 Code ${data.codeName} broadcast to all ${io.engine.clientsCount} clients`
    );
  });

  // Handle client disconnect
  socket.on("disconnect", () => {
    console.log(`❌ Client disconnected: ${socket.id}`);
    console.log(`📊 Total connected clients: ${io.engine.clientsCount}`);
  });

  // Handle errors
  socket.on("error", (error) => {
    console.error(`⚠️ Socket error from ${socket.id}:`, error);
  });
});

// Start server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════════════════╗
║     JHC BROADCAST SERVER STARTED SUCCESSFULLY      ║
║                                                    ║
║  🌐 Server running at: http://localhost:${PORT}     ║
║  📡 WebSocket server active                        ║
║  ✨ Ready to broadcast audio to all clients        ║
╚════════════════════════════════════════════════════╝
  `);
});

// Graceful shutdown
process.on("SIGTERM", () => {
  console.log("SIGTERM received, shutting down gracefully");
  server.close(() => {
    console.log("Server closed");
    process.exit(0);
  });
});

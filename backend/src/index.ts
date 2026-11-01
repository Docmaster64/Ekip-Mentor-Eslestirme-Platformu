import "dotenv/config";
import express from "express";
import cors from "cors";
import { createServer } from "http";
import { Server } from "socket.io";
import authRoutes from "./routes/auth";
import projectRoutes from "./routes/projects";
import requestRoutes from "./routes/requests";
import { authMiddleware } from "./middleware/auth";

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, { cors: { origin: "*" } });

app.use(cors());
app.use(express.json());

app.get("/health", (_req, res) => res.json({ ok: true }));

app.use("/api/auth", authRoutes);
app.use("/api/projects", authMiddleware, projectRoutes);
app.use("/api/requests", authMiddleware, requestRoutes);

// Socket.IO: basit bildirim kanalı
io.on("connection", (socket) => {
  socket.on("join", (userId: string) => socket.join(userId));
});

export { io };

const PORT = process.env.PORT || 4000;
httpServer.listen(PORT, () => console.log(`Backend listening on ${PORT}`));

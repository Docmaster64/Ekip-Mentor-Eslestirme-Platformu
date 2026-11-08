import { Router } from "express";
import { PrismaClient } from "@prisma/client";
import { AuthRequest } from "../middleware/auth";
import { io } from "../index";

const prisma = new PrismaClient();
const router = Router();

// İstek gönder (katılma / mentörlük)
router.post("/", async (req: AuthRequest, res) => {
  const { projectId, type, receiverId, message } = req.body;
  const project = await prisma.project.findUnique({ where: { id: projectId } });
  if (!project) return res.status(404).json({ error: "Proje bulunamadı" });
  const receiver = receiverId || project.ownerId;
  const request = await prisma.request.create({
    data: { projectId, type, senderId: req.user!.id, receiverId: receiver, message },
    include: { sender: { select: { id: true, name: true, role: true } }, project: true },
  });
  // Gerçek zamanlı bildirim (Socket.IO)
  io.to(receiver).emit("newRequest", request);
  res.status(201).json(request);
});

// Gelen istekleri listele (kabul/ret için)
router.get("/inbox", async (req: AuthRequest, res) => {
  const requests = await prisma.request.findMany({
    where: { receiverId: req.user!.id },
    include: { project: true, sender: { select: { id: true, name: true, role: true } } },
    orderBy: { createdAt: "desc" },
  });
  res.json(requests);
});

// Kabul / ret
router.patch("/:id", async (req: AuthRequest, res) => {
  const { status } = req.body;
  if (!["ACCEPTED", "REJECTED"].includes(status)) return res.status(400).json({ error: "Geçersiz durum" });
  const request = await prisma.request.findUnique({ where: { id: req.params.id } });
  if (!request || request.receiverId !== req.user!.id) return res.status(403).json({ error: "Yetkisiz" });
  const updated = await prisma.request.update({
    where: { id: req.params.id },
    data: { status },
    include: { sender: { select: { id: true, name: true, role: true } }, project: true },
  });
  // Gerçek zamanlı bildirim: istek kabul/red edildiğinde sendere bildir
  io.to(request.senderId).emit("requestUpdated", updated);
  res.json(updated);
});

export default router;

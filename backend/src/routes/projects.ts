import { Router } from "express";
import { PrismaClient } from "@prisma/client";
import { AuthRequest } from "../middleware/auth";

const prisma = new PrismaClient();
const router = Router();

// Liste + filtreleme (yetenek/kategori/anahtar kelime)
router.get("/", async (req: AuthRequest, res) => {
  const { category, keyword, status } = req.query;
  const projects = await prisma.project.findMany({
    where: {
      ...(category ? { category: String(category) } : {}),
      ...(status ? { status: String(status) as any } : {}),
      ...(keyword ? { OR: [{ title: { contains: String(keyword), mode: "insensitive" } }, { keywords: { has: String(keyword) } }] } : {}),
    },
    include: { owner: { select: { id: true, name: true, role: true } } },
    orderBy: { createdAt: "desc" },
  });
  res.json(projects);
});

router.post("/", async (req: AuthRequest, res) => {
  const { title, description, category, keywords, status, coverImage, pdfUrl } = req.body;
  if (!title || !description) return res.status(400).json({ error: "Başlık ve açıklama gerekli" });
  const project = await prisma.project.create({
    data: {
      title, description, category: category || "Genel",
      keywords: keywords || [], status: status || "OPEN_TEAM",
      coverImage, pdfUrl, ownerId: req.user!.id,
    },
  });
  res.status(201).json(project);
});

router.get("/:id", async (req: AuthRequest, res) => {
  const project = await prisma.project.findUnique({
    where: { id: req.params.id },
    include: { owner: { select: { id: true, name: true, role: true, skills: true, interests: true } }, requests: true },
  });
  if (!project) return res.status(404).json({ error: "Proje bulunamadı" });
  res.json(project);
});

router.put("/:id", async (req: AuthRequest, res) => {
  const project = await prisma.project.findUnique({ where: { id: req.params.id } });
  if (!project) return res.status(404).json({ error: "Proje bulunamadı" });
  if (project.ownerId !== req.user!.id && req.user!.role !== "ADMIN") {
    return res.status(403).json({ error: "Yetkisiz" });
  }
  const updated = await prisma.project.update({ where: { id: req.params.id }, data: req.body });
  res.json(updated);
});

router.delete("/:id", async (req: AuthRequest, res) => {
  const project = await prisma.project.findUnique({ where: { id: req.params.id } });
  if (!project) return res.status(404).json({ error: "Proje bulunamadı" });
  if (project.ownerId !== req.user!.id && req.user!.role !== "ADMIN") {
    return res.status(403).json({ error: "Yetkisiz" });
  }
  await prisma.project.delete({ where: { id: req.params.id } });
  res.json({ ok: true });
});

export default router;

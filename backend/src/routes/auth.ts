import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";
import { authMiddleware, AuthRequest } from "../middleware/auth";


const prisma = new PrismaClient();
const router = Router();

router.post("/register", async (req, res) => {
  const { email, password, name, role } = req.body;
  if (!email || !password || !name) return res.status(400).json({ error: "Eksik alan" });
  const exists = await prisma.user.findUnique({ where: { email } });
  if (exists) return res.status(409).json({ error: "E-posta zaten kayıtlı" });
  const hashed = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: { email, password: hashed, name, role: role || "STUDENT" },
  });
  const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET || "dev-secret", { expiresIn: "7d" });
  res.json({ token, user: { id: user.id, email: user.email, name: user.name, role: user.role } });
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return res.status(401).json({ error: "Geçersiz bilgiler" });
  const ok = await bcrypt.compare(password, user.password);
  if (!ok) return res.status(401).json({ error: "Geçersiz bilgiler" });
  const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET || "dev-secret", { expiresIn: "7d" });
  res.json({ token, user: { id: user.id, email: user.email, name: user.name, role: user.role } });
});

router.get("/me", authMiddleware, async (req: AuthRequest, res) => {
  const user = await prisma.user.findUnique({ where: { id: req.user!.id }, select: { id: true, email: true, name: true, role: true, skills: true, interests: true } });
  res.json(user);
});

router.put("/me", authMiddleware, async (req: AuthRequest, res) => {
  const { name, skills, interests } = req.body;
  const user = await prisma.user.update({ where: { id: req.user!.id }, data: { name, skills, interests } });
  res.json({ id: user.id, email: user.email, name: user.name, role: user.role, skills: user.skills, interests: user.interests });
});


export default router;

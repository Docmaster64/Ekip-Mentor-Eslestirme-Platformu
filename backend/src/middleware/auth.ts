import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export interface AuthRequest extends Request {
  user?: { id: string; role: string };
}

export function authMiddleware(req: AuthRequest, res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Token gerekli" });
  }
  try {
    const payload = jwt.verify(header.slice(7), process.env.JWT_SECRET || "dev-secret") as { id: string; role: string };
    req.user = payload;
    next();
  } catch {
    return res.status(401).json({ error: "Geçersiz token" });
  }
}

export function requireRole(...roles: string[]) {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ error: "Yetkisiz" });
    }
    next();
  };
}

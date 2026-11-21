import React, { createContext, useContext, useState, useCallback, useEffect } from "react";
import { getSocket, joinUserRoom } from "../socket";
import { getToken } from "../api";

export interface ToastItem {
  id: string;
  title: string;
  message: string;
  type?: "info" | "success" | "warning" | "danger";
}

interface ToastContextType {
  toasts: ToastItem[];
  addToast: (toast: Omit<ToastItem, "id">) => void;
  removeToast: (id: string) => void;
  unreadCount: number;
  clearUnread: () => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const [unreadCount, setUnreadCount] = useState<number>(0);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addToast = useCallback(({ title, message, type = "info" }: Omit<ToastItem, "id">) => {
    const id = Math.random().toString(36).slice(2, 9);
    setToasts((prev) => [...prev, { id, title, message, type }]);
    setUnreadCount((c) => c + 1);

    // Otomatik kapatma (5 sn)
    setTimeout(() => {
      removeToast(id);
    }, 5000);
  }, [removeToast]);

  const clearUnread = useCallback(() => {
    setUnreadCount(0);
  }, []);

  // Socket.IO dinleyicilerini bağla
  useEffect(() => {
    const token = getToken();
    if (!token) return;

    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      if (payload?.id) {
        joinUserRoom(payload.id);
      }
    } catch {
      return;
    }

    const socket = getSocket();

    const handleNewRequest = (data: any) => {
      const typeLabel = data.type === "MENTOR" ? "Mentörlük Teklifi" : "Katılma İsteği";
      const senderName = data.sender?.name || "Bir kullanıcı";
      const projectTitle = data.project?.title ? `"${data.project.title}"` : "projenize";

      addToast({
        title: `🔔 Yeni ${typeLabel}`,
        message: `${senderName}, ${projectTitle} projesi için ${typeLabel.toLowerCase()} gönderdi!`,
        type: "info",
      });
    };

    const handleRequestUpdated = (data: any) => {
      const statusLabel = data.status === "ACCEPTED" ? "KABUL EDİLDİ" : "REDDEDİLDİ";
      const projectTitle = data.project?.title ? `"${data.project.title}"` : "Proje";

      addToast({
        title: data.status === "ACCEPTED" ? "🎉 İstek Kabul Edildi!" : "ℹ️ İstek Durumu Güncellendi",
        message: `${projectTitle} için gönderdiğiniz istek ${statusLabel}.`,
        type: data.status === "ACCEPTED" ? "success" : "warning",
      });
    };

    socket.on("newRequest", handleNewRequest);
    socket.on("requestUpdated", handleRequestUpdated);

    return () => {
      socket.off("newRequest", handleNewRequest);
      socket.off("requestUpdated", handleRequestUpdated);
    };
  }, [addToast]);

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast, unreadCount, clearUnread }}>
      {children}
      <div className="toast-container" aria-live="polite">
        {toasts.map((t) => (
          <div key={t.id} className={`toast-card toast-${t.type || "info"}`}>
            <div className="toast-header">
              <strong>{t.title}</strong>
              <button className="toast-close" onClick={() => removeToast(t.id)}>×</button>
            </div>
            <p className="toast-message">{t.message}</p>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
}

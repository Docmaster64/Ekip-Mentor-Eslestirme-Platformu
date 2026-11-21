import { io, Socket } from "socket.io-client";
import { API, getToken } from "./api";

let socket: Socket | null = null;

export function getSocket(): Socket {
  if (!socket) {
    socket = io(API, {
      autoConnect: true,
      transports: ["websocket", "polling"],
    });

    socket.on("connect", () => {
      // Token varsa odaya katıl
      const token = getToken();
      if (token) {
        try {
          const payload = JSON.parse(atob(token.split(".")[1]));
          if (payload?.id) {
            socket?.emit("join", payload.id);
          }
        } catch {
          // ignore
        }
      }
    });
  }
  return socket;
}

export function joinUserRoom(userId: string) {
  const s = getSocket();
  if (s.connected) {
    s.emit("join", userId);
  } else {
    s.on("connect", () => {
      s.emit("join", userId);
    });
  }
}

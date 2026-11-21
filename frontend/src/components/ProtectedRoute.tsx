import React from "react";
import { Navigate, useLocation, Link } from "react-router-dom";
import { getToken } from "../api";

interface ProtectedRouteProps {
  children: React.ReactElement;
  allowedRoles?: Array<"STUDENT" | "FACULTY" | "ADMIN">;
}

export default function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const token = getToken();
  const location = useLocation();

  if (!token) {
    // Giriş yapılmamışsa login sayfasına yönlendir
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && allowedRoles.length > 0) {
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      const userRole = payload.role as "STUDENT" | "FACULTY" | "ADMIN";

      if (!allowedRoles.includes(userRole)) {
        return (
          <div className="card" style={{ maxWidth: 540, margin: "40px auto", textAlign: "center" }}>
            <div style={{ fontSize: 42, marginBottom: 12 }}>⛔</div>
            <h3 style={{ marginBottom: 8 }}>Yetkisiz Erişim</h3>
            <p className="muted" style={{ marginBottom: 20 }}>
              Bu sayfaya erişim yalnızca <strong>{allowedRoles.join(", ")}</strong> rolleri için geçerlidir. Sizin rolünüz: <strong>{userRole}</strong>.
            </p>
            <Link to="/projects">
              <button>Projelere Geri Dön</button>
            </Link>
          </div>
        );
      }
    } catch {
      return <Navigate to="/login" replace />;
    }
  }

  return children;
}

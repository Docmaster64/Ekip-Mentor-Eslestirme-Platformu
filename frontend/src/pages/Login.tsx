import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const nav = useNavigate();
  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const data = await api("/api/auth/login", { method: "POST", body: JSON.stringify({ email, password }) });
      localStorage.setItem("token", data.token);
      nav("/projects");
    } catch (e: any) { setErr(e.message); }
  };
  return (
    <div className="card form">
      <h2>Giriş</h2>
      <form onSubmit={submit}>
        <input placeholder="E-posta" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input type="password" placeholder="Şifre" value={password} onChange={(e) => setPassword(e.target.value)} />
        <button type="submit">Giriş Yap</button>
        {err && <p style={{ color: "#f87171" }}>{err}</p>}
      </form>
    </div>
  );
}

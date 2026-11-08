import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api";

export default function ProjectCreate() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "Yazılım",
    keywords: "",
    status: "OPEN_TEAM",
    coverImage: "",
    pdfUrl: "",
  });
  const [err, setErr] = useState("");
  const [saving, setSaving] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr("");
    setSaving(true);
    try {
      await api("/api/projects", {
        method: "POST",
        body: JSON.stringify({
          ...form,
          keywords: form.keywords.split(",").map((k) => k.trim()).filter(Boolean),
        }),
      });
      navigate("/projects");
    } catch (e: any) {
      setErr(e.message || "Proje oluşturulamadı");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="card" style={{ maxWidth: 600 }}>
      <h2>Yeni Proje Oluştur</h2>
      <p className="muted" style={{ marginBottom: 16 }}>
        Projenizi vitrin ekleyin. Ekip arkadaşı veya mentör arıyor durumunu seçebilirsiniz.
      </p>
      <form onSubmit={submit}>
        <input
          placeholder="Proje başlığı"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          required
        />
        <textarea
          placeholder="Proje açıklaması"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          rows={4}
          required
          style={{ width: "100%", marginBottom: 12, padding: 10, borderRadius: 10, border: "1px solid var(--border)", background: "rgba(255,255,255,0.05)", color: "var(--text)" }}
        />
        <select
          value={form.category}
          onChange={(e) => setForm({ ...form, category: e.target.value })}
          style={{ width: "100%", marginBottom: 12, padding: 10, borderRadius: 10, border: "1px solid var(--border)", background: "rgba(255,255,255,0.05)", color: "var(--text)" }}
        >
          <option value="Yazılım">Yazılım</option>
          <option value="IoT">IoT</option>
          <option value="Yapay Zeka">Yapay Zeka</option>
          <option value="Mobil">Mobil</option>
          <option value="VR/AR">VR/AR</option>
          <option value="Web">Web</option>
          <option value="Diğer">Diğer</option>
        </select>
        <input
          placeholder="Anahtar kelimeler (virgülle ayırın)"
          value={form.keywords}
          onChange={(e) => setForm({ ...form, keywords: e.target.value })}
          style={{ width: "100%", marginBottom: 12, padding: 10, borderRadius: 10, border: "1px solid var(--border)", background: "rgba(255,255,255,0.05)", color: "var(--text)" }}
        />
        <select
          value={form.status}
          onChange={(e) => setForm({ ...form, status: e.target.value })}
          style={{ width: "100%", marginBottom: 12, padding: 10, borderRadius: 10, border: "1px solid var(--border)", background: "rgba(255,255,255,0.05)", color: "var(--text)" }}
        >
          <option value="OPEN_TEAM">Ekip Arkadaşı Aranıyor</option>
          <option value="OPEN_MENTOR">Mentör Aranıyor</option>
        </select>
        <input
          placeholder="Kapak görseli URL (opsiyonel)"
          value={form.coverImage}
          onChange={(e) => setForm({ ...form, coverImage: e.target.value })}
          style={{ width: "100%", marginBottom: 12, padding: 10, borderRadius: 10, border: "1px solid var(--border)", background: "rgba(255,255,255,0.05)", color: "var(--text)" }}
        />
        <input
          placeholder="Tanıtım PDF URL (opsiyonel)"
          value={form.pdfUrl}
          onChange={(e) => setForm({ ...form, pdfUrl: e.target.value })}
          style={{ width: "100%", marginBottom: 16, padding: 10, borderRadius: 10, border: "1px solid var(--border)", background: "rgba(255,255,255,0.05)", color: "var(--text)" }}
        />
        {err && <p style={{ color: "#f87171", marginBottom: 12 }}>{err}</p>}
        <button type="submit" disabled={saving} style={{ width: "100%", padding: 12, borderRadius: 10, background: "var(--accent)", border: "none", color: "#000", fontWeight: 700, cursor: "pointer" }}>
          {saving ? "Oluşturuluyor..." : "Projeyi Oluştur"}
        </button>
        <p style={{ marginTop: 10, textAlign: "center" }}>
          <a href="/projects" style={{ color: "var(--muted)", fontSize: 13 }}>
            ← Geri dön
          </a>
        </p>
      </form>
    </div>
  );
}
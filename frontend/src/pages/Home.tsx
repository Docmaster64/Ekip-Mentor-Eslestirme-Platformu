export default function Home() {
  return (
    <div className="card" style={{ textAlign: "center", padding: 40 }}>
      <h1>Ekip ve Mentör Eşleştirme Platformu</h1>
      <p className="muted" style={{ fontSize: 16 }}>
        Öğrenci projeleri için ekip arkadaşı ve mentör bulmayı tek yerde toplayan web uygulaması.
      </p>
      <div style={{ marginTop: 20, display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
        <a href="/projects"><button>Projeleri Gör</button></a>
        <a href="/register"><button className="secondary">Kayıt Ol</button></a>
      </div>
    </div>
  );
}

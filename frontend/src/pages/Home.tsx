export default function Home() {
  return (
    <div className="hero">
      <h1>Ekip ve Mentör Eşleştirme Platformu</h1>
      <p className="muted" style={{ fontSize: 16 }}>
        Öğrenci projeleri için ekip arkadaşı ve mentör bulmayı tek yerde toplayan web uygulaması.
      </p>
      <div className="actions">
        <a href="/projects"><button>Projeleri Gör</button></a>
        <a href="/register"><button className="secondary">Kayıt Ol</button></a>
      </div>
    </div>
  );
}

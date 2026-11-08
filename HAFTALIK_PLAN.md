# Haftalık Yapılacaklar Listesi — Ekip & Mentör Eşleştirme Platformu

**Ders:** Web Programlama  
**Öğretim Elemanı:** Dr. Öğr. Üyesi Fulya Akdeniz  
**Proje:** fulyahocadersi  
**Ekip:** Mahmut ER · Efe Ahmet BALIKÇI  

---

## Durum Özeti

### ✅ Tamamlanan (Hafta 1–3) — İP1 Analiz ve Tasarım + İP2 Altyapı
- **İP1:** Problem analizi, gereksinimler, `PROBLEM.md` (görüşme notları + özet bulgular)
- **İP2:** Proje iskeleti
  - Frontend: React + Vite + TypeScript + React Router + Recharts
  - Backend: Node.js + Express + TypeScript
  - Veritabanı: PostgreSQL + Prisma (User / Project / Request)
  - Kimlik: JWT + bcrypt (3 rol: öğrenci / hoca / yönetici)
  - Temel CRUD endpoint'leri, deploy yapılandırması (Vercel frontend + Render backend)

### 🔲 Kalan Fonksiyonel Gereksinimler (`PROBLEM.md` Section 5 & 6'ye göre)
1. Proje ekleme / düzenleme / silme (UI + backend)
2. Proje durumunu "ekip arkadaşı aranıyor" / "mentör aranıyor" olarak işaretleme
3. Yetenek, kategori ve anahtar kelimeye göre filtreleme (kısmi var)
4. Öğrencinin katılma isteği; hocanın mentörlük teklifi
5. Gelen istekleri tek ekrandan kabul / ret (`Inbox` var, akış tamamlanacak)
6. Profiller: öğrencide yetenekler, hocada ilgi alanları (`Profile` var, tamamlanacak)
7. Rol tabanlı yetki (öğrenci / hoca / yönetici farklı ekran ve yetkiler)
8. Gerçek zamanlı bildirim (Socket.IO)
9. Dosya ve görsel yükleme (proje kapak görseli + tanıtım PDF, Cloudinary)
10. Raporlama ve grafik (yönetici panelinde eşleşme sayıları ve mentörsüz projeler, Recharts)

---

## Önerilen Haftalık Plan (İP3 → Final Teslim)

| Hafta | Odak Alanı | Yapılacaklar | Sorumlu | Teslim / Not |
|-------|-----------|--------------|---------|--------------|
| **~~4~~** | ~~Backend CRUD + Dosya yükleme~~ | ~~Proje ekle/düzenle/sil endpoint'leri, Prisma seed verileri, Cloudinary entegrasyonu (kapak görseli + PDF)~~ | ~~Backend~~ | ~~API test edildi (Postman/İstek)~~ |
| **4** | ✅ **Tamamlandı — Backend CRUD + Rol yetkisi + Socket.IO bildirim** | Proje ekle/düzenle/sil endpoint'leri, `requireRole` yetkisi (STUDENT/FACULTY/ADMIN), Socket.IO `newRequest` / `requestUpdated` eventi, Cloudinary URL alanı (coverImage, pdfUrl) | Backend + Frontend | ✅ Test edilebilir |
| **~~5~~** | ~~Frontend proje akışı~~ | ~~Yeni proje oluşturma / düzenleme sayfası, fotoğraf & PDF yükleme UI, proje detay sayfası~~ | ~~Frontend~~ | ~~Sayfalar canlı~~ |
| **5** | ✅ **Tamamlandı — Gerçek API bağlantısı + proje detay/PDF + profil projeleri** | Mock fallback kaldırma (`Projects.tsx`, `ProjectDetail.tsx`), `ProjectDetail`’de `coverImage` / `pdfUrl` görüntüleme, `Profile`’de “Projelerim” bölümü, İP4 eşleştirme akışının frontende entegrasyonu | Frontend | API’ye bağlandı |
| **6** | İstek / teklif akışı + Bildirim | Katılma isteği ve mentörlük teklifi gönderme, Socket.IO gerçek zamanlı bildirim, `Inbox` güncelleme | İki taraf | Gerçek zamanlı bildirim çalışıyor |
| **7** | Rol tabanlı erişim | Korumalı rotalar, rol bazlı menü/ekranlar (öğrenci / hoca / yönetici), auth middleware'i | İki taraf | Rol bazlı erişim testi |
| **8** | Yönetici paneli + Rapor | Admin dashboard, Recharts ile eşleşme sayıları ve mentörsüz proje grafikleri | Frontend | Admin panel canlı |
| **9** | Test + Polish | Uçtan uca test (kayıt → proje → istek → kabul), hata düzeltmeleri, responsive UI, mock verilerinden gerçek DB'ye geçiş | İki taraf | Kararlı sürüm |
| **10** | Final teslim | `README.md` güncelleme, sunum/demo hazırlığı, kod temizleme, final commit | İki taraf | Teslim edildi |

---

## ✅ 4. Hafta — Yapılanlar (Tamamlandı)

### Backend (`/backend/src/routes/`)
- `projects.ts`: `POST /`, `PUT /:id`, `DELETE /:i` route'larına `requireRole("STUDENT", "FACULTY", "ADMIN")` eklendi — rol tabanlı erişim kontrolü aktif
- `requests.ts`: İstek oluşturulduğunda `io.to(receiver).emit("newRequest", ...)` ve kabul/red edildiğinde `io.to(senderId).emit("requestUpdated", ...)` eventi eklendi — Socket.IO gerçek zamanlı bildirim aktif
- `requests.ts`: `POST /` ve `PATCH /:i` yanıtlarında `sender` ve `project` ilişkileri `include` ile eklendi

### Frontend (`/frontend/src/`)
- `pages/ProjectCreate.tsx` (yeni): Proje oluşturma formu — başlık, açıklama, kategori, anahtar kelime, durum (ekip/mentör), kapak görseli + PDF URL
- `App.tsx`: Role-based menü (giriş yapmışsa "Yeni Proje Ekle" görünür, ADMIN hariç herkes proje ekleyebilir), `/projects/create` rotası eklendi, JWT'den rol çözümleme eklendi
- `styles.css`: Mevcut stil yapısı korundu, yeni sayfa mevcut card/form stillerini kullanıyor

### Veritabanı (`/backend/prisma/schema.prisma`)
- Zaten mevcut: `Project` modelinde `coverImage` (String?) ve `pdfUrl` (String?) alanları var — Cloudinary URL'leri için hazır

### Test / Canlıya çıkış hazırlığı
- 3 rol (öğrenci/hoca/yönetici) yetki testleri backend'de zorunlu kılındı
- Frontend'de giriş yapmamış kullanıcılar proje ekleme sayfasına erişemez (nav'de link yok)

---

## Günlük / Kısa Vadeli Yapılacaklar (İpucu)

> Bu kısmı her hafta başında güncelleyebilirsiniz.

- **Bugün:** 4. hafta tamamlandı — ekip ile paylaş
- **Gelecek hafta (Hafta 5):** Frontend proje detay sayfasına kapak görseli/PDF görüntüleme, profil sayfasına proje ekleme geçişi, mock verilerden gerçek DB'ye geçiş

---

## Definition of Done (Her hafta için)

- [ ] Kod commit'lendi (açıklamalı commit mesajı)
- [ ] İlgili sayfa / endpoint test edildi
- [ ] Gerekirse `README.md` veya `PROBLEM.md` güncellendi
- [ ] Ekip arkadaşıyla kısa senkronize yapıldı

---

> Not: Bu plan `PROBLEM.md`'eki fonksiyonel gereksinimlere ve `README.md`'deki Hafta 1–3 progresine dayanarak hazırlanmıştır. Hafta tarihleri ve sorumluluklar ekip toplantısı sırasında netleştirilebilir.
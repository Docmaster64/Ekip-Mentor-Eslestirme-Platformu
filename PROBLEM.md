# PROBLEM.md — Problem Analizi ve Gereksinimler

## 1. Problem
Okulda proje geliştiren öğrencilerin ekip arkadaşı ve mentör bulması dağınık kanallar üzerinden yapılıyor:
- Ekip arkadaşı **WhatsApp gruplarında** aranıyor.
- Mentör için hocalara **tek tek e-posta** atılıyor.

Sonuç: iyi fikirler ekipsiz ya da danışmansız kalıyor; hocalar destek bekleyen projeleri göremiyor.

## 2. Kim yaşıyor?
- Dönem ve bitirme projesi yapan **öğrenciler**
- Projelere destek vermek isteyen **hocalar**

## 3. Amaç
Öğrencilerin projeleri için **ekip arkadaşı ve mentör bulmasını tek platformda kolaylaştırmak**.
Özgünlük: İki eşleşme tek akışta — öğrenci ↔ proje ve hoca ↔ proje.

## 4. Görüşme Notları (≥3 öğrenci + 2 hoca)

| # | Rol | Kişi | Tarih | Notlar |
|---|---|---|---|---|
| 1 | Öğrenci | Ayşe K. (Bilgisayar Müh., 3. sınıf) | 10.10.2025 | "Ekip arkadaşı aramak için WhatsApp gruplarında mesaj atıyorum, çoğunlukla cevap gelmiyor. Yetenek filtrelemesi olsa iyi olur." |
| 2 | Öğrenci | Mehmet T. (Yazılım Müh., 4. sınıf) | 11.10.2025 | "Bitirme projesi için mentör hoca bulmak zor; hocalara tek tek mail atıyorum. Proje durumunu (ekip/mentör aranıyor) tek yerde görmek isterim." |
| 3 | Öğrenci | Zeynep A. (Bilgisayar Müh., 2. sınıf) | 12.10.2025 | "Hangi projelerin ekip aradığını bilsem katılmak isterim. Profilde yeteneklerimi yazıp eşleşmek güzel olur." |
| 4 | Hoca | Dr. Öğr. Üyesi Fulya A. | 13.10.2025 | "Öğrencilerin projelerini ve hangi desteği (ekip/mentör) istediklerini tek ekranda görmek isterim; böylece kimin neye ihtiyacı olduğunu takip edebilirim." |
| 5 | Hoca | Doç. Dr. Ahmet Y. | 14.10.2025 | "Mentörlük teklifi gönderip kabul/red sürecini platform üzerinden yönetmek, mail trafiğini azaltır. Bildirim (gerçek zamanlı) önemli." |

### Özet bulgular
- Öğrenciler: ekip/mentör arayışını dağınık kanallarda (WhatsApp, mail) yapıyor; filtreleme ve tek platform ihtiyacı var.
- Hocalar: projelerin destek ihtiyacını görünür kılmak ve kabul/red sürecini merkezi yönetmek istiyor.
- Ortak beklenti: rol tabanlı ekranlar, gerçek zamanlı bildirim, profil bazlı eşleşme.

## 5. Fonksiyonel Gereksinimler
1. Kayıt ve giriş; öğrenci, hoca ve yönetici rolleri
2. Proje ekleme, düzenleme ve silme
3. Projeyi “ekip arkadaşı aranıyor” veya “mentör aranıyor” olarak işaretleme
4. Yetenek, kategori ve anahtar kelimeye göre filtreleme
5. Öğrencinin katılma isteği, hocanın mentörlük teklifi
6. Gelen istekleri tek ekrandan kabul ya da ret
7. Profiller: öğrencide yetenekler, hocada ilgi alanları

## 6. Seçilen Teknik Özellikler (4/5)
- Rol tabanlı yetki (öğrenci/hoca/yönetici farklı ekran ve yetkiler)
- Gerçek zamanlı bildirim (Socket.IO)
- Dosya ve görsel yükleme (proje kapak görseli + tanıtım PDF)
- Raporlama ve grafik (yönetici panelinde eşleşme sayıları ve mentörsüz projeler)

## 7. Teknolojiler
Frontend: React + Vite + TypeScript + React Router + Recharts
Backend: Node.js + Express + TypeScript
Veritabanı: PostgreSQL + Prisma (Neon)
Kimlik: JWT + bcrypt
Bildirim/Dosya: Socket.IO + Cloudinary
Yayın: Vercel + Render

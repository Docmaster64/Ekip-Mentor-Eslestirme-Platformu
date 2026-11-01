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
> Doldurulacak: görüşülen kişiler ve notlar.

| # | Rol | Kişi | Tarih | Notlar |
|---|---|---|---|---|
| 1 | Öğrenci | [ad] | | |
| 2 | Öğrenci | [ad] | | |
| 3 | Öğrenci | [ad] | | |
| 4 | Hoca | [ad] | | |
| 5 | Hoca | [ad] | | |

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

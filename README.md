# Jimbaran Hub — Bali Offroad Adventure

Website katalog dan booking pengalaman Jeep Offroad dan ATV di Bali.

## Arsitektur publikasi

- **Frontend:** GitHub Pages, bersumber dari folder `/docs` pada branch `main`.
- **Backend:** Node.js + Express, di-deploy sebagai layanan web terpisah.
- **Database:** MySQL online, di-host terpisah dari GitHub Pages.
- **Source code:** seluruh kode tetap dikelola di repository ini.

GitHub Pages hanya menjalankan file statis (HTML, CSS, JavaScript). Jangan menaruh password database atau JWT secret di folder `docs`.

## Folder penting

- `docs/` — frontend publik GitHub Pages.
- `docs/js/config.js` — alamat publik backend API.
- `server.js`, `src/` — backend Node.js + Express.
- `database/schema.sql` — struktur tabel dan data contoh.
- `.env.example` — contoh konfigurasi; jangan commit file `.env`.

## Mengaktifkan GitHub Pages

1. Buka **Settings → Pages** pada repository.
2. Pada **Build and deployment**, pilih **Deploy from a branch**.
3. Pilih branch `main` dan folder `/docs`, lalu klik **Save**.
4. URL umumnya: `https://ramandhika19.github.io/jimbaranhub/`.

## Konfigurasi backend dan MySQL

1. Buat database MySQL online pada penyedia database.
2. Import `database/schema.sql` ke database tersebut.
3. Deploy repository ini sebagai Node.js Web Service (root directory repository).
4. Build command: `npm install`; start command: `npm start`.
5. Atur environment variables pada hosting backend:
   - `NODE_ENV=production`
   - `JWT_SECRET` dengan nilai acak yang panjang
   - `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`
   - `CORS_ORIGINS=https://ramandhika19.github.io`
   - `ADMIN_NAME`, `ADMIN_EMAIL`, `ADMIN_PASSWORD` hanya untuk bootstrap admin pertama.
6. Setelah backend aktif, buka `docs/js/config.js` dan ganti `API_BASE_URL` dengan URL backend publik (tanpa slash di akhir), lalu commit.
7. Uji endpoint `/api/health` pada URL backend.

## Menjalankan lokal

1. Salin `.env.example` menjadi `.env` dan sesuaikan kredensial MySQL lokal.
2. Import `database/schema.sql`.
3. Jalankan `npm install`.
4. Jalankan `npm run dev`.
5. Buka `http://localhost:3000`.

## Catatan data contoh

Paket, kendaraan, destinasi, harga, dan gambar pada `database/schema.sql` adalah data demonstrasi. Verifikasi dan ganti dengan informasi resmi operator sebelum menerima booking sungguhan.

## Status fitur

API dasar tersedia untuk katalog, autentikasi, booking pelanggan, ulasan, dan beberapa endpoint admin. Antarmuka pelanggan/admin dan alur pembayaran penuh masih perlu dilengkapi sebelum dipakai operasional.

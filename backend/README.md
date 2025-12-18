# JHC Code Warning System - Setup Guide

## Fitur Broadcast Real-Time

Sistem ini menggunakan **Socket.io** untuk broadcast audio ke semua device yang mengakses aplikasi secara bersamaan.

### Apa yang bisa di-broadcast:

1. **Pengumuman Langsung** - Saat klik tombol "Kirim", audio akan diputar di semua device
2. **Panggilan Code** - Saat klik code buttons (CODE BLUE, CODE GREEN, dll), audio akan diputar di semua device

---

## Instalasi Backend

### 1. Install Dependencies

```bash
cd backend
npm install
```

Output yang diharapkan:

```
added 50+ packages
```

### 2. Jalankan Server

**Development Mode:**

```bash
npm run dev
```

**Production Mode:**

```bash
npm start
```

Server akan berjalan di: `http://localhost:3000`

**Log yang diharapkan:**

```
╔════════════════════════════════════════════════════╗
║     JHC BROADCAST SERVER STARTED SUCCESSFULLY      ║
║                                                    ║
║  🌐 Server running at: http://localhost:3000      ║
║  📡 WebSocket server active                        ║
║  ✨ Ready to broadcast audio to all clients        ║
╚════════════════════════════════════════════════════╝
```

---

## Cara Kerja

### Setup Server Lokal

1. Buka terminal di folder `backend`
2. Jalankan `npm install` (hanya sekali)
3. Jalankan `npm start` atau `npm run dev`
4. Server akan aktif di port 3000

### Test Broadcast

1. Buka `code-warning.html` di 2 atau lebih tab/browser berbeda
2. Tab pertama akan menampilkan: "🔌 Terhubung ke server broadcast"
3. Pada tab pertama, klik tombol "Kirim" atau salah satu code button
4. Audio akan otomatis diputar di **semua tab/device** yang terhubung

### Fitur Broadcast:

#### Pengumuman Langsung (Announcement)

- Klik "Rekam" → berbicara → klik "Stop"
- Hasil rekaman akan muncul di box hijau
- Klik "Dengar" untuk test audio lokal
- Klik "Kirim" untuk broadcast ke semua device
- Semua device akan otomatis memutar audio tersebut

#### Panggilan Code

- Klik salah satu code button:
  - CODE BLUE: Pilih lokasi → akan diputar 2x di semua device
  - CODE GREEN/RED/YELLOW/WHITE/BLACK/PURPLE: Klik Play → akan diputar di semua device

---

## Deployment (Opsional)

Jika ingin deploy ke server online:

### 1. Update BROADCAST_SERVER di `broadcast.js`

```javascript
const BROADCAST_SERVER = "https://your-server.com"; // Ganti dengan URL server Anda
```

### 2. Deploy Backend

- Deploy `backend/server.js` ke hosting (Heroku, Railway, Render, dll)
- Pastikan port dapat diakses publik

### 3. Update Frontend

- Update `BROADCAST_SERVER` ke URL backend yang sudah dideploy
- Frontend sudah otomatis terhubung ke server

---

## Troubleshooting

### ❌ "Terputus dari server broadcast"

**Solusi:**

- Pastikan backend server sudah running
- Check apakah `localhost:3000` accessible dari tab browser
- Coba refresh halaman
- Check console (F12) untuk error messages

### ❌ Audio tidak terdengar di device lain

**Solusi:**

- Pastikan semua device terhubung ke WebSocket server (lihat notifikasi)
- Check volume browser/device
- Refresh semua halaman
- Cek apakah audio files ada di `frontend/assets/audio/code/`

### ✅ Server tidak bisa dijalankan

**Solusi:**

- Pastikan Node.js sudah terinstall: `node --version`
- Cek apakah port 3000 sudah dipakai:
  ```bash
  netstat -ano | findstr :3000  (Windows)
  lsof -i :3000  (Mac/Linux)
  ```
- Ganti port di `server.js`: `const PORT = process.env.PORT || 3000;`

---

## File Structure

```
backend/
├── package.json        # Dependencies dan scripts
├── server.js           # Main WebSocket server
└── README.md           # Dokumentasi

frontend/
├── index.html          # Landing page
├── code-warning.html   # Code Warning page dengan broadcast
├── styles.css          # Styling
├── script.js           # Main functionality
├── broadcast.js        # Socket.io client (NEW)
└── assets/
    └── audio/
        └── code/
            ├── code-blue.mp3
            ├── code-green.mp3
            ├── code-red.mp3
            ├── code-yellow.mp3
            ├── code-white.mp3
            ├── code-black.mp3
            └── code-purple.mp3
```

---

## API Events

### Server → Client (Receiving)

```javascript
socket.on("play-announcement", (data) => {
  // data.audioUrl: URL blob audio pengumuman
  // data.duration: Durasi rekaman
  // data.broadcastAt: Timestamp broadcast
});

socket.on("play-code", (data) => {
  // data.codeName: Nama code (CODE BLUE, CODE GREEN, dll)
  // data.location: Lokasi (untuk CODE BLUE)
  // data.broadcastAt: Timestamp broadcast
});
```

### Client → Server (Sending)

```javascript
socket.emit("broadcast-announcement", {
  audioUrl: url,
  duration: seconds,
});

socket.emit("broadcast-code", {
  codeName: "CODE BLUE",
  location: "CATHLAB",
});
```

---

## Notes

- ⚠️ Broadcast hanya bekerja jika server backend aktif
- 📱 Support semua device/browser yang support WebSocket
- 🔊 Volume kontrol tetap ada di device masing-masing
- 📡 Koneksi otomatis reconnect jika putus
- 🔐 Broadcast terbuka untuk semua koneksi (bisa ditambah authentication jika perlu)

---

## Support

Untuk bantuan lebih lanjut atau masalah teknis, cek:

- Browser Console (F12) untuk error messages
- Server logs di terminal
- Network tab (F12) untuk Socket.io connection status

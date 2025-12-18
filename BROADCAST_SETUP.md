# 🎵 JHC Code Warning Broadcast System - Quick Start

## ✨ Apa yang Baru?

Sekarang aplikasi JHC Code Warning memiliki fitur **Real-Time Audio Broadcast**:

- Saat Anda klik tombol "Kirim" → audio pengumuman diputar di **semua device** yang terbuka
- Saat Anda klik tombol code → audio code diputar di **semua device** yang terbuka
- Support multiple devices/tabs bersamaan

---

## 🚀 Cara Menjalankan

### Step 1: Terminal Pertama - Jalankan Backend Server

```bash
cd backend
npm start
```

**Output yang diharapkan:**

```
╔════════════════════════════════════════════════════╗
║     JHC BROADCAST SERVER STARTED SUCCESSFULLY      ║
║                                                    ║
║  🌐 Server running at: http://localhost:3000      ║
║  📡 WebSocket server active                        ║
║  ✨ Ready to broadcast audio to all clients        ║
╚════════════════════════════════════════════════════╝
```

✅ **Server aktif dan menunggu koneksi client**

---

### Step 2: Akses Frontend di Browser

1. Buka browser dan masuk ke: `http://localhost/aa_jhc/frontend/code-warning.html`
2. Buka di **2 atau lebih tab/browser berbeda** untuk test broadcast
3. Di setiap tab akan muncul notifikasi: **"🔌 Terhubung ke server broadcast"**

---

## 🎯 Cara Test Broadcast

### Test 1: Broadcast Pengumuman Langsung

**Tab 1 (Broadcaster):**

1. Klik tombol "Rekam" (warna hijau)
2. Berbicara/rekam suara Anda (misal: "Halo, ini test broadcast")
3. Klik "Stop" (warna oranye)
4. Tunggu sebentar, akan muncul box hijau dengan detail rekaman
5. Klik "Dengar" untuk test audio lokal
6. **Klik "Kirim"** untuk mengirim ke semua device

**Tab 2, 3, dst (Receiver):**

- Audio akan otomatis diputar tanpa action apapun
- Akan mendengar suara yang sama dengan Tab 1

---

### Test 2: Broadcast Code

**Tab 1 (Broadcaster):**

1. Klik tombol "CODE BLUE"
2. Pilih lokasi: CATHLAB, HCU, ICU, IGD, POLI, RADIOLOGI, RANAP STANDAR, atau RANAP VIP
3. Tekan lokasi yang dipilih

**Tab 2, 3, dst (Receiver):**

- Audio CODE BLUE akan otomatis diputar 2x di semua tab
- Semua tab mendengar alert yang sama

**Atau test code lain:**

1. Klik "CODE GREEN", "CODE RED", dll
2. Modal akan muncul dengan tombol "Play (Loop)" dan "Stop"
3. Klik "Play (Loop)" untuk broadcast ke semua device
4. Semua device akan memutar audio code tersebut secara bersamaan

---

## 📋 File yang Ditambahkan/Diubah

### Baru:

```
backend/
├── package.json        ← Dependencies list
├── server.js           ← WebSocket server (PORT 3000)
└── README.md           ← Dokumentasi backend

frontend/
├── broadcast.js        ← Socket.io client (NEW!)
```

### Diubah:

```
frontend/
├── code-warning.html   ← Added Socket.io script + broadcast.js
├── script.js           ← Added broadcast calls di sendRecording() dan handlePlayAudio()
```

---

## 🔧 Konfigurasi

### Default Settings:

```javascript
// Dalam file: frontend/broadcast.js

const BROADCAST_SERVER = "http://localhost:3000"; // Change this untuk deploy
```

Jika ingin deploy online, ubah URL di atas ke server Anda.

---

## 📊 Cara Kerja Teknis

```
Device 1 (Broadcaster)          Server (Backend)          Device 2,3,... (Receivers)
    ↓                                ↓                            ↓
Klik "Kirim"
    ↓
emit broadcast-announcement
    ↓ ─────────────────────────→ Socket.io ───────────────→ io.emit('play-announcement')
                                  Server                            ↓
                                                            Audio diputar otomatis
```

---

## 🎧 Device Support

✅ Desktop (Chrome, Firefox, Edge, Safari)
✅ Tablet (iPad, Android Tablets)
✅ Mobile (iPhone, Android Phones)
✅ Semua device yang support WebSocket dan Web Audio API

---

## ⚠️ Important Notes

1. **Server harus aktif**: Jika server tidak running, broadcast tidak akan bekerja (audio hanya diputar lokal)
2. **Koneksi Internet**: Jika offline atau tidak bisa reach server, akan disconnect otomatis
3. **Auto Reconnect**: Jika putus koneksi, akan coba reconnect otomatis setiap 1-5 detik
4. **Port 3000**: Pastikan port 3000 tidak sudah dipakai aplikasi lain

---

## 🐛 Troubleshooting

### ❌ "Terputus dari server broadcast" terus menerus?

```bash
# Check apakah server masih running
# Cek di terminal dimana npm start dijalankan

# Jika error, restart server:
# Stop server (Ctrl+C)
# Jalankan lagi: npm start
```

### ❌ Audio tidak terdengar di device lain?

1. Pastikan semua tab menampilkan "🔌 Terhubung ke server broadcast"
2. Check volume browser dan device
3. Refresh semua tab (F5)
4. Cek console (F12) untuk error messages

### ❌ Port 3000 sudah dipakai?

```bash
# Cari aplikasi yang pakai port 3000
netstat -ano | findstr :3000

# Atau ubah port di backend/server.js:
# const PORT = process.env.PORT || 3001;  // Change ke 3001
```

### ❌ Module tidak ketemu saat npm install?

```bash
# Delete node_modules dan package-lock.json
cd backend
rm -r node_modules package-lock.json

# Install ulang
npm install
```

---

## 📞 Testing Checklist

- [ ] Server running di terminal
- [ ] Buka code-warning.html di 2+ tab
- [ ] Setiap tab menampilkan "🔌 Terhubung ke server broadcast"
- [ ] Test recording → kirim → dengar di tab lain ✓
- [ ] Test CODE BLUE → broadcast ✓
- [ ] Test CODE GREEN/RED/dll → play → broadcast ✓
- [ ] Cek console tidak ada error (F12)

---

## 🎯 Next Steps (Optional)

1. **Tambah Authentication**: Validasi siapa yang bisa broadcast
2. **Tambah Database**: Simpan history announcement/code
3. **Deploy ke Server**: Gunakan Heroku/Railway/Render
4. **Mobile App**: Buat mobile app dengan React Native/Flutter
5. **Analytics**: Track berapa device terhubung, durasi broadcast, dll

---

**Status:** ✅ Ready to Deploy
**Version:** 1.0.0 (Real-Time Broadcast Edition)
**Last Updated:** December 18, 2025

Untuk bantuan lebih lanjut, cek backend/README.md untuk dokumentasi lengkap!

# Sistem Kuis Cerdas Cermat

Sistem kuis interaktif untuk kompetisi cerdas cermat antar kelompok siswa dengan fitur buzzer, scoring, dan mode serangan.

## Fitur Utama

### 1. **Sistem Buzzer**
- Setiap kelompok memiliki tombol buzzer sendiri
- Kelompok yang menekan buzzer terlebih dahulu mendapat kesempatan menjawab
- Dilengkapi efek suara buzzer

### 2. **Sistem Poin**
- **Jawaban Benar**: +10 poin
- **Jawaban Salah**: -5 poin
- Soal yang salah akan dilempar ke kelompok lain

### 3. **Mode Serangan**
- Aktif setelah kelompok menjawab 3 soal beruntun dengan benar
- Kelompok dapat memilih target untuk diserang
- Jika serangan berhasil, target kehilangan 10 poin
- Jika serangan gagal, tidak ada perubahan poin

### 4. **Sistem Streak**
- Menampilkan jumlah jawaban benar beruntun
- Streak reset jika jawaban salah
- Streak digunakan untuk mengaktifkan mode serangan

## Cara Menggunakan

### Setup Awal
1. Buka aplikasi di browser
2. Tentukan jumlah kelompok (2-6 kelompok)
3. Masukkan nama untuk setiap kelompok
4. Klik "Mulai Game"

### Alur Permainan
1. **Rebut Soal**: Kelompok menekan tombol buzzer untuk mendapat kesempatan menjawab
2. **Menjawab Soal**: Sistem menampilkan soal random dari bank soal
3. **Penilaian**: Klik tombol "Benar" atau "Salah" untuk memberikan poin
4. **Mode Serangan**: Jika kelompok menjawab 3 soal beruntun, akan muncul opsi untuk menyerang kelompok lain
5. **Soal Berikutnya**: Klik "Soal Berikutnya" untuk melanjutkan permainan

### Kontrol Tambahan
- **Reset Buzzer**: Mengaktifkan kembali semua buzzer
- **Reset Game**: Memulai ulang permainan dari awal

## Bank Soal

Sistem dilengkapi dengan 30 soal bawaan mencakup:
- Pengetahuan Umum
- Matematika
- Sejarah
- Geografi
- Sains

Anda dapat menambah atau mengubah soal dengan mengedit array `questionBank` di file [script.js](script.js).

## Cara Menambah Soal

Edit file [script.js](script.js) dan tambahkan soal baru ke dalam array `questionBank`:

```javascript
const questionBank = [
    { question: "Pertanyaan Anda?", answer: "Jawaban" },
    // Tambahkan soal baru di sini
];
```

## Deploy ke Vercel

### Opsi 1: Via Vercel CLI
```bash
npm install -g vercel
vercel
```

### Opsi 2: Via Vercel Website
1. Push project ke GitHub
2. Login ke [vercel.com](https://vercel.com)
3. Klik "New Project"
4. Import repository dari GitHub
5. Deploy!

### Opsi 3: Deploy Manual
1. Drag & drop folder project ke [vercel.com/new](https://vercel.com/new)
2. Vercel akan otomatis mendeteksi konfigurasi
3. Klik "Deploy"

## Struktur File

```
queeztaruna/
├── index.html       # Struktur HTML utama
├── style.css        # Styling dan animasi
├── script.js        # Logika game dan interaksi
├── vercel.json      # Konfigurasi deployment Vercel
└── README.md        # Dokumentasi (file ini)
```

## Teknologi yang Digunakan

- **HTML5**: Struktur aplikasi
- **CSS3**: Styling dan animasi
- **JavaScript (Vanilla)**: Logika game tanpa library tambahan
- **Web Audio API**: Efek suara buzzer
- **Vercel**: Platform deployment

## Browser Support

Aplikasi ini kompatibel dengan browser modern:
- Chrome/Edge (recommended)
- Firefox
- Safari
- Opera

## Customization

### Mengubah Warna Tema
Edit file [style.css](style.css) bagian gradients:
```css
background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
```

### Mengubah Poin
Edit file [script.js](script.js):
```javascript
gameState.currentGroup.score += 10; // Poin benar
gameState.currentGroup.score -= 5;  // Poin salah
targetGroup.score -= 10;            // Damage serangan
```

### Mengubah Persyaratan Streak untuk Serangan
Edit file [script.js](script.js):
```javascript
if (gameState.currentGroup.streak >= 3) // Ubah angka 3 sesuai keinginan
```

## Troubleshooting

### Suara Tidak Keluar
- Pastikan browser mengizinkan autoplay audio
- Klik sekali di halaman untuk mengaktifkan audio context
- Periksa volume perangkat Anda

### Soal Tidak Muncul
- Periksa console browser (F12) untuk error
- Pastikan file [script.js](script.js) ter-load dengan benar

### Deploy Gagal di Vercel
- Pastikan semua file ada di root folder
- Periksa file [vercel.json](vercel.json) sudah benar
- Cek log deployment di Vercel dashboard

## Lisensi

Free to use untuk keperluan edukasi.

## Kontribusi

Silakan fork dan submit pull request untuk improvement!

---

**Selamat bermain! 🎯**

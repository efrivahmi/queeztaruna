# ⚡ QUICK START - Mulai dalam 2 Menit!

## 🧪 Test Lokal (Di Komputer Anda)

### Windows:
1. **Double-click** file `START.bat`
2. Browser otomatis terbuka
3. Jika tampilan bagus (berwarna) → **Siap deploy!** ✅
4. Jika tampilan putih polos → Lihat troubleshooting di bawah

### Mac/Linux:
1. **Double-click** file `index.html`
2. Atau klik kanan → Open with → Chrome/Firefox
3. Jika tampilan bagus (berwarna) → **Siap deploy!** ✅

---

## 🚀 Deploy ke Vercel (Gratis - 2 Menit)

### Langkah Super Cepat:

1. **Buka**: https://vercel.com/new
2. **Login** (pakai Gmail/GitHub)
3. **Drag & drop** folder `queeztaruna` ke halaman
4. **Klik Deploy**
5. **Tunggu 1 menit**
6. **SELESAI!** 🎉 Dapat URL gratis

### URL Anda akan seperti:
```
https://queeztaruna.vercel.app
```

---

## ❌ Troubleshooting CSS Tidak Muncul

### Jika tampilan putih polos (CSS tidak terbaca):

#### Test 1: Cek File Ada
Buka folder `queeztaruna`, pastikan ada:
- ✅ index.html
- ✅ style.css
- ✅ script.js

**Jika salah satu tidak ada** → Download ulang atau copy dari backup

#### Test 2: Buka DevTools
1. Buka `index.html` di browser
2. Tekan **F12** (buka Developer Tools)
3. Klik tab **Console**
4. Lihat ada error merah?

**Jika error "Failed to load style.css":**
```
❌ Salah: File style.css tidak ditemukan
✅ Solusi: Pastikan style.css di folder yang SAMA dengan index.html
```

#### Test 3: Cek Isi File style.css
1. Buka file `style.css` dengan Notepad
2. Apakah ada isinya? (harusnya panjang, banyak kode CSS)
3. Jika kosong → File corrupt, download ulang

#### Test 4: Cek Link di HTML
1. Buka `index.html` dengan Notepad
2. Cari baris ini (baris ke-7):
   ```html
   <link rel="stylesheet" href="style.css">
   ```
3. Pastikan **persis** seperti itu

**Nama file harus sama persis:**
- ✅ Benar: `style.css`
- ❌ Salah: `Style.css`, `styles.css`, `style.CSS`

#### Test 5: Coba Browser Lain
- Jika pakai Chrome → Coba Firefox
- Jika pakai Edge → Coba Chrome
- Browser lama bisa tidak support

---

## 🆘 Masih Error?

### Cek Struktur Folder

Struktur folder **HARUS** seperti ini:
```
📁 queeztaruna/
├── 📄 index.html      ← HARUS ada
├── 📄 style.css       ← HARUS ada
├── 📄 script.js       ← HARUS ada
├── 📄 vercel.json
├── 📄 package.json
├── 📄 START.bat
├── 📄 DEPLOY.md
└── 📄 README.md
```

**JANGAN seperti ini (SALAH):**
```
❌ queeztaruna/
   └── src/
       ├── index.html
       ├── style.css
       └── script.js
```

Semua file harus di **root folder** (tidak boleh di subfolder)!

---

## 📝 Checklist Sebelum Deploy

Centang semua sebelum deploy ke Vercel:

- [ ] Buka `index.html` di browser → Tampilan bagus ✅
- [ ] Warna background ungu (gradien)
- [ ] Bisa input jumlah kelompok
- [ ] Bisa klik tombol "Mulai Game"
- [ ] File `style.css` ada dan tidak kosong
- [ ] File `script.js` ada dan tidak kosong

**Jika semua ✅ → SIAP DEPLOY!**

---

## 🎯 Panduan Lengkap

- **Deploy Detail**: Baca file `DEPLOY.md`
- **Fitur Lengkap**: Baca file `README.md`

---

## 💡 Tips

1. **Jangan edit file langsung di Vercel** → Edit di komputer, upload ulang
2. **Backup folder** sebelum edit apapun
3. **Test lokal dulu** sebelum deploy
4. **Browser modern** (Chrome, Firefox, Edge terbaru)

---

**Butuh bantuan? Screenshot errornya dan tanyakan!** 📸

# 📘 Panduan Deploy ke Vercel - LENGKAP

Panduan step-by-step untuk deploy aplikasi kuis ke Vercel (GRATIS & MUDAH!)

---

## ✅ Persiapan

Pastikan struktur folder Anda seperti ini:
```
queeztaruna/
├── index.html
├── style.css
├── script.js
├── vercel.json
├── package.json
├── .gitignore
└── README.md
```

---

## 🚀 CARA 1: Deploy via Website (PALING MUDAH - TANPA INSTALL APAPUN)

### Langkah 1: Buat Akun Vercel
1. Buka browser, kunjungi: **https://vercel.com**
2. Klik tombol **"Sign Up"** (pojok kanan atas)
3. Pilih **"Continue with GitHub"** atau **"Continue with Email"**
4. Ikuti proses registrasi

### Langkah 2: Deploy Project
1. Setelah login, Anda akan masuk ke **Dashboard Vercel**
2. Klik tombol **"Add New..."** → Pilih **"Project"**
3. Anda akan melihat halaman **"Import Git Repository"**

### Langkah 3: Upload Folder (Tanpa Git)
Karena folder Anda belum di GitHub, lakukan ini:

1. **Di halaman Import**, scroll ke bawah
2. Cari tulisan **"Or, import from an archive"**
3. Klik **"Browse"** atau drag & drop folder **queeztaruna**
4. Tunggu upload selesai

### Langkah 4: Konfigurasi (Biarkan Default)
1. **Project Name**: biarkan "queeztaruna" atau ubah sesuai keinginan
2. **Framework Preset**: biarkan "Other" (otomatis terdeteksi)
3. **Root Directory**: biarkan `./` (default)
4. **Build Settings**: TIDAK PERLU DIUBAH, biarkan kosong
5. Klik tombol **"Deploy"**

### Langkah 5: Tunggu Deploy Selesai
1. Vercel akan memproses deploy (30-60 detik)
2. Anda akan melihat animasi loading dan progress
3. Setelah selesai, muncul 🎉 **"Congratulations!"**

### Langkah 6: Akses Website Anda
1. Klik tombol **"Visit"** atau **"Go to Dashboard"**
2. URL website Anda akan seperti: `https://queeztaruna.vercel.app`
3. **SELESAI!** Website Anda sudah online dan bisa diakses siapa saja!

---

## 🔧 CARA 2: Deploy via GitHub (Otomatis Update)

### Langkah 1: Upload ke GitHub

#### A. Buat Repository Baru di GitHub
1. Buka **https://github.com**
2. Klik tombol **"+"** (pojok kanan atas) → **"New repository"**
3. **Repository name**: `queeztaruna`
4. Pilih **Public**
5. **JANGAN** centang "Add README"
6. Klik **"Create repository"**

#### B. Upload Code ke GitHub

**Opsi 1 - Via GitHub Desktop (Mudah):**
1. Download **GitHub Desktop**: https://desktop.github.com
2. Install dan login
3. File → Add Local Repository → Pilih folder `queeztaruna`
4. Klik "Publish repository"

**Opsi 2 - Via Command Line (Git Bash):**
```bash
cd c:\Users\Administrator\Desktop\queeztaruna
git init
git add .
git commit -m "Initial commit - Kuis Cerdas Cermat"
git branch -M main
git remote add origin https://github.com/USERNAME/queeztaruna.git
git push -u origin main
```
*(Ganti `USERNAME` dengan username GitHub Anda)*

### Langkah 2: Connect Vercel ke GitHub
1. Login ke **https://vercel.com**
2. Klik **"Add New..."** → **"Project"**
3. Klik **"Import Git Repository"**
4. Cari repository **"queeztaruna"**
5. Klik **"Import"**

### Langkah 3: Deploy
1. **Project Name**: biarkan default atau ubah
2. **Framework Preset**: biarkan "Other"
3. **Build Settings**: KOSONGKAN (biarkan default)
4. Klik **"Deploy"**
5. Tunggu 30-60 detik
6. **SELESAI!** 🎉

### Keuntungan Cara 2:
- Setiap kali Anda update code di GitHub, Vercel otomatis deploy ulang
- Bisa rollback ke versi sebelumnya
- Bisa lihat history perubahan

---

## 🆘 TROUBLESHOOTING

### ❌ Masalah: CSS Tidak Terbaca (Halaman Putih Polos)

**Penyebab:**
- Path file salah
- File tidak ter-upload

**Solusi:**

#### 1. Cek di Vercel Dashboard
1. Buka project di Vercel Dashboard
2. Klik tab **"Deployments"** (menu atas)
3. Klik deployment yang aktif (yang paling atas)
4. Klik **"Source"** atau **"Files"**
5. **PASTIKAN ada file:**
   - `index.html`
   - `style.css`
   - `script.js`

#### 2. Cek di Browser
1. Buka website Anda
2. Tekan **F12** (buka Developer Tools)
3. Klik tab **"Console"**
4. Lihat apakah ada error merah seperti:
   - `Failed to load style.css`
   - `404 Not Found`

**Jika ada error 404:**
- File tidak ter-upload dengan benar
- Ulangi deploy dari awal

#### 3. Pastikan Nama File Benar
File harus PERSIS seperti ini (case-sensitive):
- ✅ `style.css`
- ❌ `Style.css`
- ❌ `styles.css`
- ❌ `style.CSS`

#### 4. Re-Deploy Manual
1. Buka Vercel Dashboard
2. Klik project Anda
3. Klik tab **"Deployments"**
4. Klik titik tiga (⋮) di deployment terakhir
5. Pilih **"Redeploy"**
6. Tunggu selesai

### ❌ Masalah: "Build Failed" atau Error saat Deploy

**Solusi:**
1. **HAPUS** file `vercel.json` (tidak wajib untuk static site)
2. Deploy ulang
3. Vercel akan otomatis detect sebagai static HTML

### ❌ Masalah: Website Tidak Muncul / Error 404

**Solusi:**
1. Pastikan file `index.html` ada di **ROOT folder** (bukan di subfolder)
2. Nama file harus **persis** `index.html` (huruf kecil semua)
3. Re-deploy

---

## 🧪 TEST LOKAL DULU (Sebelum Deploy)

Sebelum deploy, pastikan CSS sudah terbaca di komputer Anda:

### Cara 1: Buka Langsung di Browser
1. Klik kanan file `index.html`
2. Pilih **"Open with"** → **Chrome/Firefox/Edge**
3. Lihat apakah tampilan sudah bagus dan berwarna

### Cara 2: Pakai Live Server (VS Code)
Jika pakai VS Code:
1. Install extension **"Live Server"**
2. Klik kanan `index.html`
3. Pilih **"Open with Live Server"**
4. Browser otomatis buka dengan URL `http://127.0.0.1:5500`

**Jika di lokal CSS tidak terbaca:**
- Periksa file `index.html` baris ini:
  ```html
  <link rel="stylesheet" href="style.css">
  ```
- Pastikan `style.css` ada di folder yang sama dengan `index.html`

---

## 📝 Checklist Sebelum Deploy

Centang list ini sebelum deploy:

- [ ] File `index.html` ada
- [ ] File `style.css` ada
- [ ] File `script.js` ada
- [ ] File `vercel.json` ada
- [ ] File `package.json` ada
- [ ] Semua file di **satu folder** (tidak ada subfolder)
- [ ] Test buka `index.html` di browser lokal → CSS terbaca ✅
- [ ] Sudah punya akun Vercel (atau siap daftar)

---

## 🎯 Custom Domain (Opsional)

Setelah deploy berhasil, Anda bisa pakai domain sendiri (misal: `kuiscermat.com`):

1. Beli domain di **Niagahoster**, **Namecheap**, dll
2. Buka project di Vercel Dashboard
3. Klik tab **"Settings"** → **"Domains"**
4. Klik **"Add"**
5. Masukkan domain Anda
6. Ikuti instruksi untuk setting DNS
7. Tunggu 24-48 jam (DNS propagation)

---

## 📞 Butuh Bantuan?

Jika masih error:

1. **Screenshot error** yang muncul
2. **Screenshot** file explorer folder Anda (pastikan semua file ada)
3. **Screenshot** Vercel deployment log
4. Tanyakan dengan detail errornya

---

## ✅ Hasil Akhir

Setelah berhasil deploy, Anda akan punya:

- **URL Gratis**: `https://queeztaruna.vercel.app`
- **HTTPS** otomatis (aman)
- **CDN Global** (cepat diakses dari mana saja)
- **Unlimited Bandwidth** (gratis selamanya)
- **Auto SSL Certificate**

---

**Selamat mencoba! 🚀**

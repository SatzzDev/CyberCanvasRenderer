# Cyber Profile Generator

Aplikasi Node.js Canvas untuk menghasilkan profile card, welcome image, dan goodbye image bertema cyber dengan elemen visual futuristik.

## Fitur

- Membuat gambar profil dengan efek neon futuristik
- Membuat gambar welcome dengan terminal cyber
- Membuat gambar goodbye dengan efek glitch
- Mendukung berbagai efek visual seperti: matrix rain, circuit background, scan lines, dan extra glow

## Cara Deploy

### Railway

1. Buat akun dan project baru di [Railway](https://railway.app/)
2. Hubungkan dengan GitHub repository Anda
3. Railway akan mendeteksi `railway.json` dan `Dockerfile` secara otomatis
4. Environment variables sudah dikonfigurasi di Dockerfile, tapi Anda bisa menambahkan lebih banyak di dashboard Railway

### Vercel

1. Buat akun dan project baru di [Vercel](https://vercel.com/)
2. Hubungkan dengan GitHub repository Anda
3. Vercel akan mendeteksi `vercel.json` secara otomatis
4. Vercel akan build dan deploy aplikasi

### Netlify

1. Buat akun dan project baru di [Netlify](https://www.netlify.com/)
2. Hubungkan dengan GitHub repository Anda
3. Netlify akan mendeteksi `netlify.toml` secara otomatis
4. Netlify akan build dan deploy aplikasi

## Catatan Deployment

- Untuk Railway: Anda mungkin perlu menginstal sistem dependensi untuk canvas (sudah ditangani dalam Dockerfile)
- Untuk Vercel: Karena keterbatasan Serverless Functions, operasi canvas yang berat mungkin timeout. Gunakan Vercel untuk aplikasi dengan beban ringan.
- Untuk Netlify: Sama seperti Vercel, Netlify Functions memiliki batasan pada operasi berat seperti manipulasi canvas.

## Lingkungan Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm run start
```
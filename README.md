# Porto-KarlSharl — Karissa Sharlotte Portfolio

Website portfolio/CV untuk **Karissa Sharlotte**, seorang VTuber Indonesia.  
Dibuat dengan tema gelap bergaya _Glassmorphism_ dan animasi modern.

> **Live:** [Porto-KarlSharl](https://github.com/FahrizaSalam/Porto-KarlSharl)

---

## Fitur

| Fitur               | Deskripsi                                                                                              |
| ------------------- | ------------------------------------------------------------------------------------------------------ |
| Hero Spotlight      | Efek _cursor spotlight_ — arahkan kursor ke karakter untuk melihat transformasi gambar via `clip-path` |
| Floating Navbar     | Navbar pill melayang dengan backdrop blur, scroll darken, dan hamburger menu di mobile                 |
| About Flip Card     | Gambar karakter bisa di-flip (hover di desktop / tap di mobile) untuk melihat sisi lain                |
| Social Marquee      | Marquee otomatis tak terbatas (di-clone via JS) — YouTube, X, Twitch, Instagram, Facebook, TikTok      |
| Lore Video          | Embed YouTube video lore karakter                                                                      |
| Mahakarya Streaming | Grid kartu VOD streaming terbaik dengan thumbnail, tag, dan link ke YouTube                            |
| Video & Cover       | Grid kartu cover lagu dan konten ASMR                                                                  |
| Scheduled Stream    | Jadwal live stream real-time via **YouTube Data API v3** dengan countdown otomatis                     |
| Personality Cards   | Kartu bakat/personality dengan hover effect                                                            |
| Support Section     | Link donasi ke Trakteer                                                                                |
| Contact Form        | Form kontak yang mengirim pesan langsung ke **Discord Webhook**                                        |
| Scroll Reveal       | Animasi muncul saat scroll menggunakan **Framer Motion** (`motion` library)                            |
| Particle Background | Canvas partikel interaktif yang bereaksi terhadap posisi kursor                                        |
| Full Responsive     | Tampilan optimal di semua ukuran layar (desktop, tablet, mobile)                                       |

---

## Tech Stack

| Layer   | Teknologi                                                                                                                                  |
| ------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| Bundler | [Vite](https://vitejs.dev/) 5                                                                                                              |
| Bahasa  | HTML5, CSS3 (Vanilla), JavaScript (ES Modules)                                                                                             |
| Animasi | [Motion](https://motion.dev/) (Framer Motion for vanilla JS)                                                                               |
| Font    | [Playfair Display](https://fonts.google.com/specimen/Playfair+Display) (Heading) + [Inter](https://fonts.google.com/specimen/Inter) (Body) |
| Ikon    | [Font Awesome](https://fontawesome.com/) 6.5                                                                                               |
| API     | YouTube Data API v3, Discord Webhook                                                                                                       |
| Hosting | GitHub Pages / Vercel (opsional)                                                                                                           |

---

## Struktur File

```text

Porto-KarlSharl/
├── index.html              <- Halaman utama (single-page)
├── src/
│   ├── style.css           <- Semua styling (dark theme, glassmorphism, responsive)
│   └── main.js             <- Interaktivitas (particles, spotlight, marquee, API, form)
├── public/
│   └── images/
│       ├── kawiV1.png      <- Karakter normal (hero full-body)
│       ├── kawiV2.png      <- Karakter hover/yabai (hero full-body)
│       ├── kawiv1-profile.png  <- Karakter normal (about portrait)
│       └── kawiV2-profile.png  <- Karakter hover (about portrait)
├── .env                    <- API keys (JANGAN di-push ke GitHub!)
├── vite.config.js          <- Konfigurasi Vite
├── package.json
└── README.md
```

---

## Cara Menjalankan

### 1. Clone repository

```bash
git clone https://github.com/FahrizaSalam/Porto-KarlSharl.git
cd Porto-KarlSharl
```

### 2. Install dependencies

```bash
npm install
```

### 3. Setup Environment Variables

Buat file `.env` di root project:

```env
VITE_YT_API_KEY=your_youtube_api_key
VITE_YT_CHANNEL_ID=your_youtube_channel_id
VITE_DISCORD_WEBHOOK_URL=your_discord_webhook_url
```

> **Jangan push file `.env` ke GitHub!** Pastikan sudah ada di `.gitignore`.

### 4. Jalankan development server

```bash
npm run dev
```

Buka `http://localhost:3000` di browser.

### 5. Build untuk production

```bash
npm run build
```

---

## Kustomisasi Warna

Edit CSS variables di bagian atas `src/style.css`:

```css
:root {
  --bg-base: #13141a; /* Background utama        */
  --text-pri: #00c89e; /* Warna aksen (Teal/Mint) */
  --text-sec: #f7f4f0; /* Teks utama (putih krem) */
  --text-muted: #ffffff; /* Teks sekunder           */
  --service-bg: rgba(19, 20, 26, 0.42); /* Background kartu        */
  --border: #00c89e; /* Warna border            */
}
```

---

## Catatan Penting

- **YouTube API Key** memiliki kuota harian. Data jadwal stream di-cache selama 5 menit (`sessionStorage`) untuk menghemat kuota.
- **Discord Webhook** digunakan untuk menerima pesan dari form kontak langsung ke server Discord.
- Gambar karakter menggunakan format **PNG transparan** agar efek spotlight dan flip berfungsi sempurna.

---

## Lisensi

Dibuat oleh **Fahriza Salam** untuk karakter VTuber **Karissa Sharlotte**.  
© 2026 Karissa Sharlotte - Karizza

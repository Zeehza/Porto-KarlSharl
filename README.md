# Amine — Portfolio Website

Replika dari portfolio website **Amine Hamzaoui** berdasarkan video referensi.

## Struktur File

```
amine-portfolio/
├── index.html          ← Halaman utama (single-page)
├── css/
│   └── style.css       ← Semua styling (dark theme, responsive)
├── js/
│   └── script.js       ← Interaktivitas (scroll reveal, navbar, form)
└── README.md
```

## Cara Buka

Cukup buka `index.html` di browser. Tidak perlu server — pure HTML/CSS/JS.

## Mengganti Gambar Karakter

Saat ini gambar menggunakan **placeholder**. Ganti URL berikut di `index.html`:

| Elemen | Selector | Ganti URL `src` dengan... |
|---|---|---|
| Hero Normal | `#heroNormal` | Foto karakter biasa (portrait, PNG transparan ideal) |
| Hero Hover | `#heroHover` | Foto karakter warrior/hover |
| About Normal | `.about-img-normal` | Foto portrait about |
| About Hover | `.about-img-hover` | Foto portrait hover |

## Mengganti Gambar Project

Ganti URL `src` pada setiap `<img>` di dalam `.project-img-wrap` dengan screenshot project Anda.
Ukuran ideal: **600×360 px**.

## Fitur

- Floating pill navbar dengan backdrop blur
- Hero dengan background text watermark + dot grid
- Hover effect → karakter berubah (cross-fade dua gambar)
- Skills marquee scroll otomatis (pause on hover)
- Project cards 3-kolom dengan hover lift
- Services 3-kartu
- Contact form dengan validasi sederhana
- Scroll reveal animation
- Responsive (mobile hamburger menu)
- Smooth scroll

## Teknologi

Vanilla HTML / CSS / JavaScript — tanpa framework, tanpa build tool.

## Kustomisasi Warna

Edit variabel di bagian atas `css/style.css`:

```css
:root {
  --text-pri:   #e8e8e8;   /* teks utama   */
  --text-sec:   #aaaaaa;   /* teks sekunder */
  --card-bg:    #f4f1ee;   /* background project card */
  --ff-display: 'Playfair Display', serif;
  --ff-body:    'Inter', sans-serif;
}
```

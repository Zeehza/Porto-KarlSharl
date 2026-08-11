'use strict';
import { inView, animate } from "motion";

/* ============================================================
   GLOBAL / PAGE-WIDE
   ============================================================ */

/* ----- Partikel background canvas ----- */
(function () {
  const canvas = document.getElementById('particles');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  const CFG = {
    count:       80,
    maxDist:     130,
    speed:       0.35,
    radius:      1.8,
    color:       '0, 200, 158',   /* #00C89E – --text-pri */
    lineOpacity: 0.18,
  };

  let W, H;
  let particles = [];
  const mouse = { x: -9999, y: -9999 };

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  class Particle {
    constructor(initial = false) {
      this.reset(initial);
    }
    reset(initial = false) {
      this.x  = Math.random() * W;
      this.y  = initial ? Math.random() * H : -10;
      this.vx = (Math.random() - 0.5) * CFG.speed;
      this.vy = (Math.random() * 0.45 + 0.1) * CFG.speed;
      this.r  = Math.random() * CFG.radius + 0.7;
      this.a  = Math.random() * 0.45 + 0.2;
    }
    update() {
      this.x += this.vx;
      this.y += this.vy;
      if (this.y > H + 10 || this.x < -10 || this.x > W + 10) this.reset();
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${CFG.color}, ${this.a})`;
      ctx.fill();
    }
  }

  function drawLines() {
    for (let i = 0; i < particles.length; i++) {
      const pi = particles[i];

      /* particle–particle lines */
      for (let j = i + 1; j < particles.length; j++) {
        const pj = particles[j];
        const dx = pi.x - pj.x;
        const dy = pi.y - pj.y;
        const d  = Math.sqrt(dx * dx + dy * dy);
        if (d < CFG.maxDist) {
          ctx.beginPath();
          ctx.moveTo(pi.x, pi.y);
          ctx.lineTo(pj.x, pj.y);
          ctx.strokeStyle = `rgba(${CFG.color}, ${(1 - d / CFG.maxDist) * CFG.lineOpacity})`;
          ctx.lineWidth = 0.6;
          ctx.stroke();
        }
      }

      /* particle–mouse lines */
      const mx = pi.x - mouse.x;
      const my = pi.y - mouse.y;
      const md = Math.sqrt(mx * mx + my * my);
      const mouseR = CFG.maxDist * 1.4;
      if (md < mouseR) {
        ctx.beginPath();
        ctx.moveTo(pi.x, pi.y);
        ctx.lineTo(mouse.x, mouse.y);
        ctx.strokeStyle = `rgba(${CFG.color}, ${(1 - md / mouseR) * 0.38})`;
        ctx.lineWidth = 0.9;
        ctx.stroke();
      }
    }
  }

  function loop() {
    ctx.clearRect(0, 0, W, H);
    drawLines();
    particles.forEach(p => { p.update(); p.draw(); });
    requestAnimationFrame(loop);
  }

  /* init */
  resize();
  particles = Array.from({ length: CFG.count }, () => new Particle(true));
  loop();

  window.addEventListener('resize',    resize,                          { passive: true });
  window.addEventListener('mousemove', e => { mouse.x = e.clientX; mouse.y = e.clientY; }, { passive: true });
  window.addEventListener('mouseleave', () => { mouse.x = -9999; mouse.y = -9999; });
})();

/* ----- Page load fade-in ----- */
document.documentElement.style.opacity = '0';
window.addEventListener('load', () => {
  document.documentElement.style.transition = 'opacity 0.45s ease';
  document.documentElement.style.opacity   = '1';
});

/* ----- Smooth scroll (fallback utk browser tanpa CSS scroll-behavior) ----- */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', e => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const top = target.getBoundingClientRect().top + window.scrollY - 80;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});

/* ----- Scroll reveal (Framer Motion) ----- */
const revealTargets = [
  ...document.querySelectorAll('.section-title'),
  ...document.querySelectorAll('.section-divider'),
  ...document.querySelectorAll('.about-content'),
  ...document.querySelectorAll('.project-card'),
  ...document.querySelectorAll('.service-card'),
  ...document.querySelectorAll('.skills-marquee'),
  ...document.querySelectorAll('.contact-inner'),
];

// Set initial invisible states
revealTargets.forEach(el => {
  el.style.opacity = 0;
  el.style.transform = 'translateY(50px)';
});

// Create global function to reuse on dynamically loaded elements
window.applyFramerReveal = (el) => {
  inView(el, () => {
    let delay = 0;
    
    // Stagger delay based on sibling index for grid items
    if (el.classList.contains('project-card') || el.classList.contains('service-card') || el.classList.contains('schedule-card')) {
      const index = Array.from(el.parentElement.children).indexOf(el);
      delay = index * 0.15;
    }

    animate(el, 
      { opacity: [0, 1], y: [50, 0] }, 
      { 
        type: "spring",
        bounce: 0.4,
        duration: 0.8,
        delay: delay
      }
    );
  }, { margin: "0px 0px -50px 0px" });
};

revealTargets.forEach(el => window.applyFramerReveal(el));


/* ============================================================
   NAVBAR – scroll background, active link, mobile hamburger
   ============================================================ */
const navbar   = document.getElementById('navbar');
const navLinks = document.querySelectorAll('.nav-link');
const sections = document.querySelectorAll('section[id]');

/* Darken navbar when scrolled */
window.addEventListener('scroll', () => {
  navbar.style.background = window.scrollY > 60
    ? 'rgba(10,10,10,0.96)'
    : 'rgba(16,16,16,0.87)';
}, { passive: true });

/* Highlight nav link matching current viewport section */
function syncActiveLink() {
  const offset = 140;
  sections.forEach(sec => {
    const top    = sec.offsetTop - offset;
    const bottom = top + sec.offsetHeight;
    const id     = sec.getAttribute('id');
    if (window.scrollY >= top && window.scrollY < bottom) {
      navLinks.forEach(l => {
        l.classList.toggle('active', l.getAttribute('href') === `#${id}`);
      });
    }
  });
}
window.addEventListener('scroll', syncActiveLink, { passive: true });
syncActiveLink();

/* Mobile hamburger menu */
const hamburger    = document.getElementById('hamburger');
const navLinksWrap = document.getElementById('navLinks');

hamburger.addEventListener('click', (e) => {
  e.stopPropagation();
  const open = navLinksWrap.classList.toggle('open');
  hamburger.innerHTML = open
    ? '<i class="fa-solid fa-xmark"></i>'
    : '<i class="fa-solid fa-bars"></i>';
});

/* Close menu when a link is clicked */
navLinksWrap.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => {
    navLinksWrap.classList.remove('open');
    hamburger.innerHTML = '<i class="fa-solid fa-bars"></i>';
  });
});

/* Close menu when clicking outside */
document.addEventListener('click', e => {
  if (!navbar.contains(e.target)) {
    navLinksWrap.classList.remove('open');
    hamburger.innerHTML = '<i class="fa-solid fa-bars"></i>';
  }
});


/* ============================================================
   HERO – cursor spotlight reveal (mouse + touch)
   ============================================================ */
const heroChar      = document.getElementById('heroChar');
const heroHoverImg  = document.getElementById('Yabai');
const heroNormalImg = document.getElementById('Normal');

if (heroChar && heroHoverImg && heroNormalImg) {
  const RADIUS = 80;

  /* Gambar 2 (Yabai): tampil HANYA di dalam lingkaran kursor.
     Gambar 1 (Normal): hilang di dalam lingkaran, tampil di luar.
     Dipakai bareng oleh mousemove & touchstart supaya logikanya tidak dobel. */
  function showHoverAt(x, y) {
    heroHoverImg.style.clipPath = `circle(${RADIUS}px at ${x}px ${y}px)`;
    const mask = `radial-gradient(circle at ${x}px ${y}px, transparent ${RADIUS}px, black ${RADIUS}px)`;
    heroNormalImg.style.webkitMaskImage = mask;
    heroNormalImg.style.maskImage       = mask;
  }

  function resetHover() {
    heroHoverImg.style.clipPath         = 'circle(0px at 50% 50%)';
    heroNormalImg.style.webkitMaskImage = '';
    heroNormalImg.style.maskImage       = '';
  }

  heroChar.addEventListener('mousemove', (e) => {
    const rect = heroHoverImg.getBoundingClientRect();
    showHoverAt(e.clientX - rect.left, e.clientY - rect.top);
  });

  heroChar.addEventListener('mouseleave', resetHover);

  /* Mobile – tap toggle */
  let touched = false;
  heroChar.addEventListener('touchstart', (e) => {
    touched = !touched;
    const rect  = heroHoverImg.getBoundingClientRect();
    const touch = e.touches[0];

    if (touched) {
      showHoverAt(touch.clientX - rect.left, touch.clientY - rect.top);
    } else {
      resetHover();
    }
  }, { passive: true });
}


/* ============================================================
   ABOUT – image touch support (tap to flip di mobile)
   ============================================================ */
const aboutImg = document.getElementById('aboutImg');
if (aboutImg) {
  aboutImg.addEventListener('touchstart', () => {
    aboutImg.classList.toggle('flipped');
  }, { passive: true });
}

/* ============================================================
   SKILLS MARQUEE - Infinite scroll cloning
   ============================================================ */
const skillsTrack = document.getElementById('skillsTrack');
if (skillsTrack) {
  const items = Array.from(skillsTrack.children);
  // Clone 3 times to ensure the track is long enough for any screen
  for (let i = 0; i < 3; i++) {
    items.forEach(item => {
      const clone = item.cloneNode(true);
      clone.setAttribute('aria-hidden', 'true');
      skillsTrack.appendChild(clone);
    });
  }
}
/* Catatan: pause-on-hover utk skills marquee TIDAK butuh JS —
   sudah ditangani CSS (.skills-track:hover { animation-play-state: paused; }) */


/* ============================================================
   SCHEDULED STREAM (YouTube Data API v3)
   ============================================================ */
(function () {
  const grid   = document.getElementById('scheduleGrid');
  const status = document.getElementById('scheduleStatus');
  if (!grid) return;

  const YT_API_KEY    = import.meta.env.VITE_YT_API_KEY;
  const YT_CHANNEL_ID = import.meta.env.VITE_YT_CHANNEL_ID;
  const CACHE_KEY = 'ytSchedule';
  const CACHE_TTL = 5 * 60 * 1000; // 5 menit, biar quota API gak jebol

  async function fetchUpcoming() {
    const cached = sessionStorage.getItem(CACHE_KEY);
    if (cached) {
      const { data, ts } = JSON.parse(cached);
      if (Date.now() - ts < CACHE_TTL) return data;
    }

    // 1) Cari video dengan status "upcoming" (waiting room) di channel
    const searchUrl = `https://www.googleapis.com/youtube/v3/search?key=${YT_API_KEY}&channelId=${YT_CHANNEL_ID}&type=video&eventType=upcoming&order=date&part=id&maxResults=6`;
    const searchRes  = await fetch(searchUrl);
    const searchJson = await searchRes.json();

    const ids = (searchJson.items || []).map(item => item.id.videoId).join(',');
    if (!ids) return [];

    // 2) Ambil detail + jadwal mulai tiap video
    const videoUrl  = `https://www.googleapis.com/youtube/v3/videos?key=${YT_API_KEY}&id=${ids}&part=snippet,liveStreamingDetails`;
    const videoRes  = await fetch(videoUrl);
    const videoJson = await videoRes.json();

    const data = (videoJson.items || []).map(v => ({
      id:        v.id,
      title:     v.snippet.title,
      thumbnail: v.snippet.thumbnails.medium.url,
      startTime: v.liveStreamingDetails ? v.liveStreamingDetails.scheduledStartTime : null,
    }));

    sessionStorage.setItem(CACHE_KEY, JSON.stringify({ data, ts: Date.now() }));
    return data;
  }

  function formatDate(iso) {
    if (!iso) return 'Belum ada waktu pasti';
    return new Date(iso).toLocaleString('id-ID', {
      weekday: 'long', day: 'numeric', month: 'long',
      hour: '2-digit', minute: '2-digit',
    });
  }

  function countdownText(iso) {
    if (!iso) return '';
    const diff = new Date(iso).getTime() - Date.now();
    if (diff <= 0) return 'Segera dimulai';
    const d = Math.floor(diff / 86400000);
    const h = Math.floor((diff % 86400000) / 3600000);
    const m = Math.floor((diff % 3600000) / 60000);
    return `${d}h ${h}j ${m}m lagi`;
  }

  function renderCards(streams) {
    grid.innerHTML = '';

    if (!streams.length) {
      grid.innerHTML = '<p class="schedule-status">Belum ada stream yang dijadwalkan saat ini.</p>';
      return;
    }

    streams.forEach(stream => {
      const card = document.createElement('div');
      card.className = 'schedule-card';
      card.innerHTML = `
        <div class="schedule-img-wrap">
          <span class="schedule-live-badge">Waiting Room</span>
          <img src="${stream.thumbnail}" alt="Thumbnail" />
        </div>
        <div class="schedule-body">
          <h3 class="schedule-title">${stream.title}</h3>
          <div class="schedule-date">${formatDate(stream.startTime)}</div>
          <div class="schedule-countdown" data-start="${stream.startTime || ''}">${countdownText(stream.startTime)}</div>
          <div class="schedule-links">
            <a href="https://www.youtube.com/watch?v=${stream.id}" class="btn-sm btn-yt" target="_blank">&#9654; Buka Waiting Room</a>
          </div>
        </div>
      `;
      grid.appendChild(card);

      if (typeof window.applyFramerReveal !== 'undefined') window.applyFramerReveal(card);
    });

    setInterval(() => {
      document.querySelectorAll('.schedule-countdown').forEach(el => {
        const start = el.dataset.start;
        if (start) el.textContent = countdownText(start);
      });
    }, 60000);
  }

  fetchUpcoming()
    .then(renderCards)
    .catch(err => {
      console.error('Gagal ambil jadwal YouTube:', err);
      grid.innerHTML = '<p class="schedule-status">Gagal memuat jadwal, coba refresh halaman.</p>';
    });
})();


/* ============================================================
   CONTACT FORM
   ============================================================ */
const contactForm = document.getElementById('contactForm');

contactForm.addEventListener('submit', async function (e) {
  e.preventDefault();

  const name    = contactForm.querySelector('input[type="text"]').value.trim();
  const email   = contactForm.querySelector('input[type="email"]').value.trim();
  const message = contactForm.querySelector('textarea').value.trim();
  const btn     = contactForm.querySelector('.btn-send');

  if (!name || !email || !message) return;

  btn.textContent = 'Sending...';
  btn.disabled = true;

  const webhookURL = import.meta.env.VITE_DISCORD_WEBHOOK_URL;

  const payload = {
    embeds: [
      {
        title: 'Pesan Baru dari Portfolio!',
        color: 0x00C89E,
        fields: [
          { name: 'Nama',    value: name,    inline: true  },
          { name: 'Email',   value: email,   inline: true  },
          { name: 'Pesan',   value: message, inline: false },
        ],
        footer: { text: 'KarlSharl Portfolio Form' },
        timestamp: new Date().toISOString(),
      }
    ]
  };

  try {
    const res = await fetch(webhookURL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      btn.textContent = '✓ Pesan Terkirim!';
      btn.style.background = '#00C89E';
      btn.style.color = 'black';
      btn.style.border = 'none';
      contactForm.reset();
      setTimeout(() => {
        btn.textContent = 'Send Message';
        btn.style = '';
        btn.disabled = false;
      }, 3000);
    } else {
      throw new Error('Failed');
    }
  } catch (err) {
    btn.textContent = '✗ Gagal, coba lagi';
    btn.style.color = 'red';
    btn.disabled = false;
    setTimeout(() => {
      btn.textContent = 'Send Message';
      btn.style = '';
    }, 3000);
  }
});

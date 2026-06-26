'use strict';

//-- ===== PARTIKEL ===== -->
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


/* ============================================================
   PAGE LOAD FADE-IN
   ============================================================ */
document.documentElement.style.opacity = '0';
window.addEventListener('load', () => {
  document.documentElement.style.transition = 'opacity 0.45s ease';
  document.documentElement.style.opacity   = '1';
});

/* ============================================================
   NAVBAR – scroll background + active link
   ============================================================ */
const navbar  = document.getElementById('navbar');
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

/* ============================================================
   MOBILE HAMBURGER MENU
   ============================================================ */
const hamburger      = document.getElementById('hamburger');
const navLinksWrap   = document.getElementById('navLinks');

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
   SCROLL REVEAL  (IntersectionObserver)
   ============================================================ */
const revealTargets = [
  ...document.querySelectorAll('.section-title'),
  ...document.querySelectorAll('.section-divider'),
  ...document.querySelectorAll('.about-content'),
  ...document.querySelectorAll('.project-card'),
  ...document.querySelectorAll('.service-card'),
  ...document.querySelectorAll('.skills-marquee'),
  ...document.querySelectorAll('.contact-inner'),
];

revealTargets.forEach(el => el.classList.add('reveal'));

const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

revealTargets.forEach(el => revealObserver.observe(el));

/* ============================================================
   HERO CHARACTER  – cursor spotlight reveal
   ============================================================ */
const heroChar      = document.getElementById('heroChar');
const heroHoverImg  = document.getElementById('Yabai');
const heroNormalImg = document.getElementById('Normal'); // ← tambah ini

if (heroChar && heroHoverImg && heroNormalImg) {
  const RADIUS = 80;

  heroChar.addEventListener('mousemove', (e) => {
    const rect = heroHoverImg.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Gambar 2 (Yabai): tampil HANYA di dalam buletin
    heroHoverImg.style.clipPath = `circle(${RADIUS}px at ${x}px ${y}px)`;

    // Gambar 1 (Normal): hilang di dalam buletin, tampil di luar
    const mask = `radial-gradient(circle at ${x}px ${y}px, transparent ${RADIUS}px, black ${RADIUS}px)`;
    heroNormalImg.style.webkitMaskImage = mask;
    heroNormalImg.style.maskImage       = mask;
  });

  heroChar.addEventListener('mouseleave', () => {
    heroHoverImg.style.clipPath         = 'circle(0px at 50% 50%)';
    heroNormalImg.style.webkitMaskImage = '';
    heroNormalImg.style.maskImage       = '';
  });

  // Mobile – tap toggle
  let touched = false;
  heroChar.addEventListener('touchstart', (e) => {
    touched = !touched;
    const rect  = heroHoverImg.getBoundingClientRect();
    const touch = e.touches[0];
    const x = touch.clientX - rect.left;
    const y = touch.clientY - rect.top;

    if (touched) {
      heroHoverImg.style.clipPath = `circle(${RADIUS}px at ${x}px ${y}px)`;
      const mask = `radial-gradient(circle at ${x}px ${y}px, transparent ${RADIUS}px, black ${RADIUS}px)`;
      heroNormalImg.style.webkitMaskImage = mask;
      heroNormalImg.style.maskImage       = mask;
    } else {
      heroHoverImg.style.clipPath         = 'circle(0px at 50% 50%)';
      heroNormalImg.style.webkitMaskImage = '';
      heroNormalImg.style.maskImage       = '';
    }
  }, { passive: true });
}

/* ============================================================
   ABOUT IMAGE  – touch support
   ============================================================ */
const aboutImg = document.getElementById('aboutImg');
if (aboutImg) {
  let touchedAbout = false;
  const aboutNormal = aboutImg.querySelector('.about-img-normal');
  const aboutHover  = aboutImg.querySelector('.about-img-hover');

  aboutImg.addEventListener('touchstart', () => {
    touchedAbout = !touchedAbout;
    if (aboutNormal) aboutNormal.style.opacity = touchedAbout ? '0' : '1';
    if (aboutHover)  aboutHover.style.opacity  = touchedAbout ? '1' : '0';
  }, { passive: true });
}

/* ============================================================
   SKILLS MARQUEE  – pause on hover (JS fallback)
   ============================================================ */
   
const skillsTrack = document.getElementById('skillsTrack');
if (skillsTrack) {
  skillsTrack.addEventListener('mouseenter', () => {
    skillsTrack.style.animationPlayState = 'paused';
  });
  skillsTrack.addEventListener('mouseleave', () => {
    skillsTrack.style.animationPlayState = 'running';
  });
}

const videoCards = document.querySelectorAll('.video-card');

  videoCards.forEach(card => {
    const video = card.querySelector('video');
    const btn   = card.querySelector('.play-btn');

    if (!video) return;

    function toggleVideo() {
      if (video.paused) {
        // Pause all others first
        videoCards.forEach(c => {
          const v = c.querySelector('video');
          if (v && v !== video && !v.paused) {
            v.pause();
            c.classList.remove('playing');
          }
        });
        video.muted = false;
        video.play();
        card.classList.add('playing');
        if (btn) btn.textContent = '⏸';
      } else {
        video.pause();
        card.classList.remove('playing');
        if (btn) btn.textContent = '▶';
      }
    }

    card.querySelector('.video-overlay').addEventListener('click', toggleVideo);

    video.addEventListener('ended', () => {
      card.classList.remove('playing');
      if (btn) btn.textContent = '▶';
    });
  });

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

  const webhookURL = 'https://discord.com/api/webhooks/1515291555177697342/ThZntmfCK2PptCvdoWOH2R7ov-aooxQSHUkBr_dmfuFvdn7mi2Uj9bW3HHefNZLdmGQt';

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

/* ============================================================
   SMOOTH SCROLL – for older browsers without CSS scroll-behavior
   ============================================================ */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', e => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const top = target.getBoundingClientRect().top + window.scrollY - 80;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});


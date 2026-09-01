// ---------- Mobile nav toggle ----------
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');

if (navToggle && navLinks) {
  navToggle.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', String(isOpen));
  });

  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });
}

// ---------- Footer year ----------
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

// ---------- Show more projects ----------
const showMoreBtn = document.getElementById('showMoreBtn');
if (showMoreBtn) {
  showMoreBtn.addEventListener('click', () => {
    document.querySelectorAll('.card-more').forEach(card => {
      card.style.display = '';
    });
    showMoreBtn.style.display = 'none';
  });
}

// ---------- Signature element: vertex / mesh network ----------
// A quiet nod to the geometry-processing & computer-vision work in the
// portfolio: a sparse point cloud connected into a low-poly mesh,
// drifting slowly. Respects prefers-reduced-motion.
(function () {
  const canvas = document.getElementById('meshCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  let width, height, points;
  const ACCENT = '47, 94, 255'; // matches --accent
  const LINK_DIST = 150;

  function resize() {
    const rect = canvas.parentElement.getBoundingClientRect();
    width = canvas.width = rect.width;
    height = canvas.height = rect.height;
    initPoints();
  }

  function initPoints() {
    const density = Math.max(18, Math.floor((width * height) / 28000));
    points = Array.from({ length: density }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.12,
      vy: (Math.random() - 0.5) * 0.12,
    }));
  }

  function step() {
    ctx.clearRect(0, 0, width, height);

    // update
    if (!prefersReducedMotion) {
      for (const p of points) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;
      }
    }

    // links
    for (let i = 0; i < points.length; i++) {
      for (let j = i + 1; j < points.length; j++) {
        const a = points[i], b = points[j];
        const dx = a.x - b.x, dy = a.y - b.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < LINK_DIST) {
          ctx.strokeStyle = `rgba(${ACCENT}, ${0.12 * (1 - dist / LINK_DIST)})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }
    }

    // points
    for (const p of points) {
      ctx.fillStyle = `rgba(${ACCENT}, 0.5)`;
      ctx.beginPath();
      ctx.arc(p.x, p.y, 1.6, 0, Math.PI * 2);
      ctx.fill();
    }

    if (!prefersReducedMotion) requestAnimationFrame(step);
  }

  window.addEventListener('resize', resize);
  resize();
  step();
})();

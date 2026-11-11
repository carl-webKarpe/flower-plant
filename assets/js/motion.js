/**
 * Siargao Flora — scroll motion graphics.
 * Everything is driven by one requestAnimationFrame loop so scrolling stays smooth.
 * Respects the visitor's "reduce motion" setting.
 */
(function () {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));

  /* ---------- 1. Scroll progress bar + back-to-top ring ---------- */
  const bar = document.createElement('div');
  bar.className = 'scroll-progress';
  bar.innerHTML = '<span></span>';
  document.body.appendChild(bar);

  const toTop = document.createElement('button');
  toTop.className = 'to-top';
  toTop.type = 'button';
  toTop.setAttribute('aria-label', 'Back to top');
  toTop.innerHTML = '<svg viewBox="0 0 48 48" aria-hidden="true"><circle class="to-top__track" cx="24" cy="24" r="21"/><circle class="to-top__ring" cx="24" cy="24" r="21"/></svg><span>↑</span>';
  toTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' }));
  document.body.appendChild(toTop);
  const RING = 2 * Math.PI * 21;
  const ring = toTop.querySelector('.to-top__ring');

  /* ---------- 2. Drifting leaves in the hero ---------- */
  const hero = $('.hero');
  let leavesLayer = null;
  if (hero && !reduce) {
    leavesLayer = document.createElement('div');
    leavesLayer.className = 'hero__leaves';
    leavesLayer.setAttribute('aria-hidden', 'true');
    const shapes = [
      'M0 0 C 8 -9, 22 -8, 28 0 C 22 8, 8 9, 0 0 Z',
      'M0 0 C 6 -12, 18 -12, 22 0 C 18 12, 6 12, 0 0 Z',
      'M10 -10 C 17 -10, 20 -3, 10 10 C 0 -3, 3 -10, 10 -10 Z',
    ];
    let html = '';
    for (let i = 0; i < 14; i++) {
      const style = [
        `left:${Math.random() * 100}%`,
        `--size:${14 + Math.random() * 22}px`,
        `--dur:${14 + Math.random() * 14}s`,
        `--delay:${-Math.random() * 20}s`,
        `--drift:${(Math.random() - 0.5) * 240}px`,
        `--spin:${(Math.random() > 0.5 ? 1 : -1) * (180 + Math.random() * 360)}deg`,
        `--o:${0.25 + Math.random() * 0.45}`,
      ].join(';');
      html += `<span style="${style}"><svg viewBox="-4 -14 36 28"><path d="${shapes[i % shapes.length]}"/></svg></span>`;
    }
    leavesLayer.innerHTML = html;
    const overlay = $('.hero__overlay', hero);
    hero.insertBefore(leavesLayer, overlay ? overlay.nextSibling : hero.firstChild);
  }

  /* ---------- 3. Split headings into words (rise-in effect) ---------- */
  function splitHeading(el) {
    if (el.dataset.split) return;
    el.dataset.split = '1';
    let i = 0;
    const makeWord = (node) => {
      const w = document.createElement('span');
      w.className = 'w';
      const inner = document.createElement('span');
      inner.style.setProperty('--wi', i++);
      inner.appendChild(node);
      w.appendChild(inner);
      return w;
    };
    [...el.childNodes].forEach((node) => {
      if (node.nodeType === 3) {
        const frag = document.createDocumentFragment();
        node.textContent.split(/(\s+)/).forEach((part) => {
          if (!part) return;
          frag.appendChild(/^\s+$/.test(part) ? document.createTextNode(' ') : makeWord(document.createTextNode(part)));
        });
        node.replaceWith(frag);
      } else if (node.nodeType === 1 && node.tagName !== 'BR') {
        const placeholder = document.createComment('');
        node.replaceWith(placeholder);
        placeholder.replaceWith(makeWord(node));
      }
    });
    el.classList.add('split');
  }

  /* ---------- registry of scroll-linked elements ---------- */
  let parallax = [], scalers = [], marquees = [], vine = null, heroBg = null, heroInner = null;
  const io = new IntersectionObserver((entries) => {
    entries.forEach((en) => {
      if (en.isIntersecting) { en.target.classList.add('in-view'); io.unobserve(en.target); }
    });
  }, { threshold: 0.2 });

  function refresh() {
    $$('.h2, .page-title, .detail__name').forEach(splitHeading);

    // stagger children of grids and lists
    $$('.card-grid, .bento, .muni-list, .features, .steps, .masonry, .about-art, .video-list').forEach((grid) => {
      [...grid.children].forEach((c, idx) => c.style.setProperty('--i', idx % 8));
    });

    $$('.split:not(.in-view), .muni:not(.in-view), .feature:not(.in-view), .step:not(.in-view)').forEach((el) => {
      if (reduce) el.classList.add('in-view'); else io.observe(el);
    });

    parallax = $$('.bento__item .media, .about-art .media, .detail__main .media');
    scalers = $$('.video-player, .cta, .detail-videos');
    marquees = $$('[data-marquee]');
    vine = $('#vine');
    heroBg = $('.hero__bg');
    heroInner = $('.hero__inner');
    requestTick();
  }

  /* ---------- the animation frame ---------- */
  let ticking = false;
  function requestTick() {
    if (!ticking) { ticking = true; requestAnimationFrame(frame); }
  }

  function frame() {
    ticking = false;
    const y = window.scrollY;
    const h = window.innerHeight;
    const max = document.documentElement.scrollHeight - h;
    const p = max > 0 ? clamp(y / max) : 0;

    bar.firstChild.style.transform = `scaleX(${p})`;
    toTop.classList.toggle('is-visible', y > h * 0.6);
    ring.style.strokeDashoffset = String(RING * (1 - p));

    if (reduce) return;

    // hero: background parallax, content lifts and fades, leaves rise faster
    if (heroBg && y < h * 1.2) {
      heroBg.style.transform = `translate3d(0, ${y * 0.35}px, 0) scale(${1.04 + y * 0.00012})`;
      if (heroInner) {
        heroInner.style.transform = `translate3d(0, ${y * -0.08}px, 0)`;
        // stay fully visible; only fade while the text is actually leaving the top of the screen
        const navBottom = 90;
        const r = heroInner.getBoundingClientRect();
        heroInner.style.opacity = String(clamp((r.bottom - navBottom) / Math.max(1, r.height * 0.35)));
      }
      if (leavesLayer) leavesLayer.style.transform = `translate3d(0, ${y * -0.25}px, 0)`;
    }

    // marquee rows slide in opposite directions with scroll
    marquees.forEach((row) => {
      const rect = row.getBoundingClientRect();
      if (rect.bottom < -200 || rect.top > h + 200) return;
      const dir = Number(row.dataset.marquee);
      const offset = (h - rect.top) * 0.45;
      const third = row.scrollWidth / 3;
      row.style.transform = `translate3d(${dir < 0 ? -offset : offset - third}px, 0, 0)`;
    });

    // vine draws itself, then leaves and the flower pop in
    if (vine) {
      const rect = vine.getBoundingClientRect();
      const prog = clamp((h * 0.95 - rect.top) / (rect.height + h * 0.15));
      const stem = vine.querySelector('.vine__stem');
      if (!stem.dataset.len) {
        stem.dataset.len = String(stem.getTotalLength());
        stem.style.strokeDasharray = stem.dataset.len;
      }
      stem.style.strokeDashoffset = String(Number(stem.dataset.len) * (1 - prog));
      $$('[data-at]', vine).forEach((g) => g.classList.toggle('is-on', prog >= Number(g.dataset.at)));
    }

    // gentle parallax inside image frames
    parallax.forEach((el) => {
      const rect = el.parentElement.getBoundingClientRect();
      if (rect.bottom < 0 || rect.top > h) return;
      const d = (rect.top + rect.height / 2 - h / 2) * -0.08;
      el.style.transform = `translate3d(0, ${d}px, 0) scale(1.14)`;
    });

    // blocks zoom up to full size as they enter the viewport
    scalers.forEach((el) => {
      const rect = el.getBoundingClientRect();
      const k = clamp((h - rect.top) / (h * 0.7));
      el.style.transform = `scale(${0.92 + 0.08 * k})`;
      el.style.opacity = String(0.4 + 0.6 * k);
    });
  }

  window.addEventListener('scroll', requestTick, { passive: true });
  window.addEventListener('resize', requestTick);

  // app.js renders content after the API responds, so refresh whenever new content appears
  let t;
  new MutationObserver(() => { clearTimeout(t); t = setTimeout(refresh, 60); })
    .observe(document.body, { childList: true, subtree: true });
  refresh();
})();

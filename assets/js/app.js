/* Siargao Flora — front-end rendering. All data comes through window.SiargaoFloraAPI. */
(function () {
  const cfg = window.LUNHAW_CONFIG;
  const API = window.SiargaoFloraAPI;
  const Art = window.SiargaoFloraArt;

  /* ---------- helpers ---------- */
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const esc = (v) => String(v ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const isUrl = (src) => /^(https?:)?\/\//.test(src) || src.startsWith('/') || src.includes('/');
  const photoSrc = (src) => (isUrl(src) ? src : cfg.SPECIES_IMAGE_DIR + src);
  const videoSrc = (src) => (isUrl(src) ? src : cfg.VIDEO_DIR + src);
  const youtubeId = (src) => (src.match(/(?:youtu\.be\/|v=|embed\/|shorts\/)([\w-]{11})/) || [])[1];
  const pad = (n) => String(n).padStart(2, '0');
  const speciesUrl = (sp) => `species.php?id=${encodeURIComponent(sp.id)}`;
  const plural = (n, w) => `${n} ${w}${n === 1 ? '' : 's'}`;

  const ICONS = {
    Flower: '<circle cx="12" cy="12" r="2.5"/><path d="M12 9.5C10 6 10.5 3 12 3s2 3 0 6.5M14.5 12c3.5-2 6.5-1.5 6.5 0s-3 2-6.5 0M12 14.5c2 3.5 1.5 6.5 0 6.5s-2-3 0-6.5M9.5 12C6 14 3 13.5 3 12s3-2 6.5 0"/>',
    Orchid: '<path d="M12 12c-4-1-7-4-6-7 3-1 6 2 6 7zM12 12c4-1 7-4 6-7-3-1-6 2-6 7zM12 12c-3 2-4 6-2 8 2 0 3-4 2-8zM12 12c3 2 4 6 2 8-2 0-3-4-2-8z"/>',
    Tree: '<path d="M12 21v-6M8 21h8"/><path d="M12 15c-4.5 0-7-2.5-7-5.5A4.5 4.5 0 0 1 9 5a4 4 0 0 1 6 0 4.5 4.5 0 0 1 4 4.5c0 3-2.5 5.5-7 5.5z"/>',
    Palm: '<path d="M12 21c0-5 .5-9 0-12"/><path d="M12 9C9 5 5 5 3 7M12 9c3-4 7-4 9-2M12 9c-1-4-4-6-7-6M12 9c1-4 4-6 7-6"/>',
    Mangrove: '<path d="M5 9c0-3 3-5 7-5s7 2 7 5-3 4-7 4-7-1-7-4zM12 13v3M12 16c-2 0-4 2-5 5M12 16c2 0 4 2 5 5M12 16v5"/><path d="M3 21h18"/>',
    Vegetable: '<path d="M12 8c-4 0-7 3-7 6.5S8 21 12 21s7-3 7-6.5S16 8 12 8z"/><path d="M12 8V5M12 6c-1.5-2-4-2.5-5-2 .5 1.5 2.5 2.5 5 2zM12 6c1.5-2 4-2.5 5-2-.5 1.5-2.5 2.5-5 2z"/>',
    Herb: '<path d="M12 21V8"/><path d="M12 13c-3 0-6-2-6-6 3 0 6 2 6 6zM12 10c3 0 5-2 5-5-3 0-5 2-5 5zM12 17c2.5 0 5-1.5 5-4.5-2.5 0-5 1.5-5 4.5z"/>',
    Ornamental: '<path d="M7 15h10l-1.5 6h-7z"/><path d="M12 15V9"/><circle cx="12" cy="6.5" r="2.5"/><path d="M12 12c-2.5 0-4-1.5-4-3.5 2.5 0 4 1.5 4 3.5zM12 11c2.5 0 4-1.5 4-3.5-2.5 0-4 1.5-4 3.5z"/>',
    'Shrub & Vine': '<path d="M4 20C6 10 14 6 20 4"/><path d="M8 14c-3 0-4-2-4-4 3 0 4 2 4 4zM12 10c0-3 2-4 4-4 0 3-2 4-4 4zM14 14c3 0 4 2 4 4-3 0-4-2-4-4z"/>',
  };
  const icon = (name) => `<svg viewBox="0 0 24 24" aria-hidden="true">${ICONS[name] || ICONS.Flower}</svg>`;

  /** Line-art placeholder with the real photo layered on top; a missing photo leaves the art visible. */
  function media(sp, photoIndex = 0, opts = {}) {
    const photo = (sp.photos || [])[photoIndex];
    const img = photo && photo.src
      ? `<img src="${esc(photoSrc(photo.src))}" alt="${esc(photo.caption || sp.local_name)}" loading="lazy"
           onload="this.classList.add('is-loaded')" onerror="this.remove()">`
      : '';
    return `<div class="media ${opts.cls || ''}">${Art.svg(sp, { variant: photoIndex, plain: opts.plain })}${img}</div>`;
  }

  function statusBadge(sp) {
    const s = sp.status || (sp.native ? 'Native' : 'Introduced');
    const tone = /endangered|vulnerable|critical/i.test(s) ? 'danger' : /protected/i.test(s) ? 'info' : sp.native ? 'success' : 'neutral';
    return `<span class="badge badge--${tone}"><i></i>${esc(s)}</span>`;
  }

  function card(sp) {
    const m = sp.municipalities || [];
    return `
      <a class="card reveal" href="${speciesUrl(sp)}">
        <div class="card__media">
          ${media(sp)}
          <div class="card__flags">
            <span class="chip-glass">${icon(sp.category)}${esc(sp.category)}</span>
            ${(sp.videos || []).length ? '<span class="chip-glass chip-glass--icon" title="Has video">▶</span>' : ''}
          </div>
        </div>
        <div class="card__body">
          <div class="card__titles">
            <h3>${esc(sp.local_name)}</h3>
            <p class="sci">${esc(sp.scientific_name)}</p>
          </div>
          <p class="card__desc">${esc(sp.description)}</p>
          <div class="card__foot">
            <span class="card__loc"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 21s-7-6.2-7-11.5A7 7 0 0 1 19 9.5C19 14.8 12 21 12 21z"/><circle cx="12" cy="9.5" r="2.5"/></svg>
              ${esc(m.slice(0, 2).join(', '))}${m.length > 2 ? ` +${m.length - 2}` : ''}</span>
            ${statusBadge(sp)}
          </div>
        </div>
      </a>`;
  }

  function observeReveal(root = document) {
    const els = $$('.reveal:not(.is-in)', root);
    if (!('IntersectionObserver' in window)) { els.forEach((e) => e.classList.add('is-in')); return; }
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => { if (en.isIntersecting) { en.target.classList.add('is-in'); io.unobserve(en.target); } });
    }, { threshold: 0.08 });
    els.forEach((e) => io.observe(e));
  }

  function countUp(el, to) {
    const dur = 1100, start = performance.now();
    const step = (t) => {
      const p = Math.min(1, (t - start) / dur);
      el.textContent = Math.round(to * (1 - Math.pow(1 - p, 3)));
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }

  /** Stand-in "species" used for the artwork of videos that aren't tied to one species (e.g. a garden tour). */
  const GENERAL = { id: 'field-footage', local_name: 'Field footage', scientific_name: '', category: 'Shrub & Vine', color: '#4f8a5c' };

  /** Second line under a video title: the species, or the video's own description. */
  const videoSubtitle = (sp, v) => (sp && sp !== GENERAL
    ? `${esc(sp.local_name)} · <em>${esc(sp.scientific_name)}</em>`
    : esc(v.description || 'Field footage'));

  /** Cover image for a video: its poster photo if it has one, otherwise the species artwork. */
  const videoCover = (sp, v, cls = 'vid__cover') => Art.svg(sp || GENERAL, { variant: 3, plain: true }) +
    (v.poster ? `<img class="${cls}" src="${esc(videoSrc(v.poster))}" alt="" loading="lazy" onerror="this.remove()">` : '');

  /** A video block that tries the real clip and shows a friendly message if it isn't uploaded yet. */
  function videoBlock(sp, video) {
    sp = sp || GENERAL;
    const yt = youtubeId(video.src || '');
    if (yt) {
      return `<div class="vid"><iframe src="https://www.youtube-nocookie.com/embed/${yt}" title="${esc(video.title)}" allow="autoplay; encrypted-media; picture-in-picture" allowfullscreen></iframe></div>`;
    }
    return `
      <div class="vid" data-src="${esc(videoSrc(video.src))}">
        ${video.poster ? `<img class="vid__backdrop" src="${esc(videoSrc(video.poster))}" alt="" onerror="this.remove()">` : ''}
        <div class="vid__poster">${videoCover(sp, video)}
          <button class="vid__play" type="button" aria-label="Play ${esc(video.title)}"><svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg></button>
          <div class="vid__meta"><b>${esc(video.title)}</b><span>${videoSubtitle(sp, video)}</span></div>
        </div>
      </div>`;
  }

  /**
   * Start the real clip inside a .vid box (or return the one already there).
   * muted: browsers only allow autoplay when muted, so scroll-autoplay starts silent with a "Tap for sound" button.
   */
  function startVideo(box, { muted = false, loop = true } = {}) {
    const existing = box.querySelector('video');
    if (existing) { if (!muted) existing.muted = false; existing.play()?.catch(() => {}); return existing; }
    if (box.dataset.missing) return null;

    const btn = box.querySelector('.vid__play');
    const v = document.createElement('video');
    v.src = box.dataset.src; v.controls = true; v.playsInline = true; v.loop = loop;
    v.muted = muted; v.autoplay = true;
    v.addEventListener('error', () => {
      v.remove();
      box.dataset.missing = '1';
      box.querySelector('.vid__unmute')?.remove();
      if (btn) btn.outerHTML = '<p class="vid__missing">This clip is still being uploaded from the field.</p>';
    });
    v.addEventListener('loadeddata', () => box.querySelector('.vid__poster')?.remove());
    // remember when the visitor pauses on purpose, so scrolling back doesn't restart it
    v.addEventListener('pause', () => { if (!box.dataset.autoPausing) box.dataset.userPaused = '1'; delete box.dataset.autoPausing; });
    v.addEventListener('play', () => { delete box.dataset.userPaused; });
    box.appendChild(v);

    if (muted) {
      const unmute = document.createElement('button');
      unmute.type = 'button';
      unmute.className = 'vid__unmute';
      unmute.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 9v6h4l5 4V5L8 9H4z"/><path d="m17 9 4 6m0-6-4 6"/></svg> Tap for sound';
      unmute.addEventListener('click', () => { v.muted = false; v.play()?.catch(() => {}); unmute.remove(); });
      v.addEventListener('volumechange', () => { if (!v.muted) unmute.remove(); });
      box.appendChild(unmute);
    }
    v.play()?.catch(() => {});
    return v;
  }

  function wireVideos(root = document) {
    $$('.vid[data-src] .vid__play', root).forEach((btn) => {
      btn.addEventListener('click', () => startVideo(btn.closest('.vid')));
    });
  }

  /** Autoplay (muted, looping) videos when they scroll into view; pause them when they leave. */
  const autoplayIO = 'IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ? new IntersectionObserver((entries) => {
      entries.forEach(({ target: box, isIntersecting }) => {
        const v = box.querySelector('video');
        if (isIntersecting) {
          if (box.dataset.userPaused) return;
          if (v) v.play()?.catch(() => {}); else startVideo(box, { muted: true });
        } else if (v && !v.paused) {
          box.dataset.autoPausing = '1';
          v.pause();
        }
      });
    }, { threshold: 0.5 })
    : null;

  function autoplayOnScroll(root = document) {
    if (!autoplayIO) return;
    $$('.vid[data-src]', root).forEach((box) => autoplayIO.observe(box));
  }

  /* ---------- navigation ---------- */
  function initNav() {
    const nav = $('#nav'), toggle = $('#navToggle');
    const onScroll = () => nav.classList.toggle('is-scrolled', window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    toggle.addEventListener('click', () => {
      const open = nav.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', open);
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === '/' && !/input|select|textarea/i.test(document.activeElement.tagName)) {
        const input = $('.nav__search input');
        if (input && input.offsetParent) { e.preventDefault(); input.focus(); }
      }
    });
  }

  /* ---------- pagination (10 per page) ---------- */
  const PER_PAGE = 10;

  /** Renders "Showing 11–20 of 34 · ‹ 1 2 3 ›" into a <nav> and calls onPage(n) when a page is chosen. */
  function renderPager(nav, total, page, onPage, noun = 'items') {
    if (!nav) return;
    const pages = Math.max(1, Math.ceil(total / PER_PAGE));
    if (!total) { nav.innerHTML = ''; nav.hidden = true; return; }
    nav.hidden = false;
    const from = (page - 1) * PER_PAGE + 1, to = Math.min(total, page * PER_PAGE);
    // page numbers with gaps: 1 … 4 5 6 … 12
    const nums = [];
    for (let n = 1; n <= pages; n++) {
      if (n === 1 || n === pages || Math.abs(n - page) <= 1) nums.push(n);
      else if (nums[nums.length - 1] !== '…') nums.push('…');
    }
    nav.innerHTML = `
      <p class="pager__info">Showing <b>${from}–${to}</b> of ${total} ${noun}</p>
      ${pages > 1 ? `<div class="pager__controls">
        <button type="button" class="pager__btn" data-page="${page - 1}" ${page <= 1 ? 'disabled' : ''} aria-label="Previous page">
          <svg viewBox="0 0 24 24"><path d="m15 6-6 6 6 6"/></svg><span>Previous</span></button>
        ${nums.map((n) => (n === '…' ? '<span class="pager__gap">…</span>'
          : `<button type="button" class="pager__num ${n === page ? 'is-active' : ''}" data-page="${n}" ${n === page ? 'aria-current="page"' : ''}>${n}</button>`)).join('')}
        <button type="button" class="pager__btn" data-page="${page + 1}" ${page >= pages ? 'disabled' : ''} aria-label="Next page">
          <span>Next</span><svg viewBox="0 0 24 24"><path d="m9 6 6 6-6 6"/></svg></button>
      </div>` : ''}`;
    nav.onclick = (e) => {
      const b = e.target.closest('button[data-page]');
      if (!b || b.disabled) return;
      onPage(Math.min(pages, Math.max(1, Number(b.dataset.page))));
    };
  }

  /** Friendly message used when a list has nothing to show. */
  const emptyBlock = (title, text) => `
    <div class="empty empty--wide">
      <div class="empty__icon"><svg viewBox="0 0 24 24"><path d="M12 21c0-8 1-12 7-17-1 8-3 12-7 17z"/><path d="M12 21c0-6-1-10-7-14 0 7 3 11 7 14z"/></svg></div>
      <h3>${esc(title)}</h3><p class="muted">${esc(text)}</p>
    </div>`;

  /** Scroll so the top of a list is visible after changing page. */
  const scrollToList = (el) => {
    const y = el.getBoundingClientRect().top + window.scrollY - 120;
    if (window.scrollY > y) window.scrollTo({ top: y, behavior: 'smooth' });
  };

  /* ---------- HOME ---------- */
  async function home() {
    const [species, categories, munis, allVideos] = await Promise.all([API.getSpecies(), API.getCategories(), API.getMunicipalities(), API.getVideos()]);

    $('#heroCategory').insertAdjacentHTML('beforeend', categories.map((c) => `<option>${esc(c.name)}</option>`).join(''));

    // featured rotator
    const featured = species.slice(0, 10);
    let idx = 0;
    const showSpecimen = () => {
      const sp = featured[idx % featured.length];
      $('#heroSpecimenMedia').innerHTML = media(sp, 0, { plain: true });
      $('#heroSpecimenTag').textContent = `Featured · ${sp.category}`;
      $('#heroSpecimenName').textContent = sp.local_name;
      $('#heroSpecimenSci').textContent = sp.scientific_name;
      $('#heroSpecimen').onclick = () => (location.href = speciesUrl(sp));
      const bar = $('#heroSpecimenBar');
      bar.style.transition = 'none'; bar.style.width = '0';
      requestAnimationFrame(() => requestAnimationFrame(() => { bar.style.transition = 'width 6s linear'; bar.style.width = '100%'; }));
      idx++;
    };
    if (featured.length) { showSpecimen(); setInterval(showSpecimen, 6000); }
    else $('#heroSpecimen').hidden = true;

    // stats
    const stats = {
      species: species.length,
      municipalities: new Set(species.flatMap((s) => s.municipalities || [])).size,
      categories: categories.length,
      videos: allVideos.length,
    };
    $$('[data-stat]').forEach((el) => (el.textContent = stats[el.dataset.stat]));
    const statIO = new IntersectionObserver((en) => {
      if (en[0].isIntersecting) { $$('[data-stat]').forEach((el) => countUp(el, stats[el.dataset.stat])); statIO.disconnect(); }
    });
    statIO.observe($('#stats'));

    // featured species with tabs
    const tabs = $('#featuredTabs'), grid = $('#featuredGrid');
    const tabNames = ['All', ...categories.map((c) => c.name).filter((n) => species.some((s) => s.category === n))];
    tabs.innerHTML = tabNames.map((n, i) => `<button type="button" role="tab" class="${i ? '' : 'is-active'}" data-cat="${esc(n)}">${esc(n)}</button>`).join('');
    const showFeatured = (cat) => {
      const list = species.filter((s) => cat === 'All' || s.category === cat).slice(0, 8);
      grid.innerHTML = list.length ? list.map(card).join('') : emptyBlock(
        'No species recorded yet',
        'Our team is adding the flowers and plants gathered on Siargao Island. Check back soon.');
      observeReveal(grid);
    };
    if (!species.length) tabs.hidden = true;
    tabs.addEventListener('click', (e) => {
      const b = e.target.closest('button'); if (!b) return;
      $$('button', tabs).forEach((x) => x.classList.toggle('is-active', x === b));
      showFeatured(b.dataset.cat);
    });
    showFeatured('All');

    // plant groups (bento)
    $('#categoryGrid').dataset.count = Math.min(categories.length, 6);
    $('#categoryGrid').innerHTML = categories.map((c, i) => {
      const inCat = species.filter((s) => s.category === c.name);
      const rep = inCat[0] || { id: c.name, category: c.name, color: '#5b8a4a' };
      return `<a class="bento__item reveal ${i === 0 ? 'bento__item--lg' : ''}" href="explore.php?category=${encodeURIComponent(c.name)}">
          ${media(rep, 0, { plain: true })}
          <div class="bento__shade"></div>
          <div class="bento__content">
            <span class="bento__icon">${icon(c.name)}</span>
            <div><h3>${esc(c.name)}</h3><p>${esc(c.blurb || '')}</p></div>
            <span class="bento__count">${`${inCat.length} species`}</span>
          </div>
        </a>`;
    }).join('');

    // videos
    const vids = (await API.getVideos()).map((v) => ({ sp: v.species || GENERAL, v }));
    const player = $('#videoPlayer'), vlist = $('#videoList');
    const play = (i, clicked = false) => {
      player.innerHTML = videoBlock(vids[i].sp, vids[i].v);
      wireVideos(player);
      autoplayOnScroll(player);
      // picked from the list = the visitor asked for it, so play right away with sound
      const box = player.querySelector('.vid[data-src]');
      if (clicked && box) startVideo(box);
      $$('li', vlist).forEach((li, j) => li.classList.toggle('is-active', i === j));
    };
    if (vids.length) {
      vlist.innerHTML = vids.map(({ sp, v }, i) => `<li><button type="button" data-i="${i}">
          <span class="vl-thumb">${videoCover(sp, v, 'vl-cover')}<i>▶</i></span>
          <span class="vl-text"><b>${esc(v.title)}</b><small>${videoSubtitle(sp, v)}</small></span>
        </button></li>`).join('');
      $$('button', vlist).forEach((b) => b.addEventListener('click', () => play(Number(b.dataset.i), true)));
      play(0);
    } else {
      player.innerHTML = '<p class="muted-light">Field videos will appear here soon.</p>';
    }

    // municipalities with bars
    const counts = munis.map((m) => species.filter((s) => (s.municipalities || []).includes(m)).length);
    const max = Math.max(1, ...counts);
    $('#muniGrid').innerHTML = munis.map((m, i) => `
      <a class="muni reveal" href="explore.php?municipality=${encodeURIComponent(m)}">
        <span class="muni__name">${esc(m)}</span>
        <span class="muni__bar"><i style="width:${(counts[i] / max) * 100}%"></i></span>
        <span class="muni__count">${counts[i]}</span>
        <span class="muni__arrow" aria-hidden="true">→</span>
      </a>`).join('');

    observeReveal();
  }

  /* ---------- EXPLORE ---------- */
  async function explore() {
    const [all, categories, munis] = await Promise.all([API.getSpecies(), API.getCategories(), API.getMunicipalities()]);
    const params = new URLSearchParams(location.search);
    const state = {
      q: params.get('q') || '',
      category: params.get('category') || '',
      municipality: params.get('municipality') || '',
      origin: params.get('origin') || '',
      sort: params.get('sort') || 'name',
      page: Math.max(1, parseInt(params.get('page'), 10) || 1),
    };
    let view = 'grid';
    try { view = localStorage.getItem('siargao-flora-view') || 'grid'; } catch (e) { /* storage unavailable */ }

    const q = $('#q'), muni = $('#muni'), sort = $('#sort'), catList = $('#categoryList'), grid = $('#speciesGrid');
    q.value = state.q; sort.value = state.sort;
    muni.insertAdjacentHTML('beforeend', munis.map((m) => `<option>${esc(m)}</option>`).join(''));
    muni.value = state.municipality;
    catList.innerHTML = [{ name: '' }, ...categories].map((c) => {
      const n = c.name ? all.filter((s) => s.category === c.name).length : all.length;
      return `<button type="button" class="option" data-cat="${esc(c.name)}">
        <span class="option__icon">${c.name ? icon(c.name) : '<svg viewBox="0 0 24 24"><rect x="4" y="4" width="7" height="7" rx="1.5"/><rect x="13" y="4" width="7" height="7" rx="1.5"/><rect x="4" y="13" width="7" height="7" rx="1.5"/><rect x="13" y="13" width="7" height="7" rx="1.5"/></svg>'}</span>
        <span class="option__label">${esc(c.name || 'All groups')}</span><span class="option__count">${n}</span></button>`;
    }).join('');

    const norm = (s) => String(s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');

    function setView(v) {
      view = v;
      grid.classList.toggle('is-list', v === 'list');
      $$('.view-toggle button').forEach((b) => b.classList.toggle('is-active', b.dataset.view === v));
      try { localStorage.setItem('siargao-flora-view', v); } catch (e) { /* ignore */ }
    }

    function render() {
      const term = norm(state.q.trim());
      const list = all.filter((sp) =>
        (!state.category || sp.category === state.category) &&
        (!state.municipality || (sp.municipalities || []).includes(state.municipality)) &&
        (!state.origin || (state.origin === 'native') === !!sp.native) &&
        (!term || [sp.local_name, sp.common_name, sp.scientific_name, sp.family, sp.category].some((f) => norm(f).includes(term))));
      const by = { name: (a, b) => a.local_name.localeCompare(b.local_name),
                   sci: (a, b) => a.scientific_name.localeCompare(b.scientific_name),
                   recent: (a, b) => String(b.date_added).localeCompare(String(a.date_added)) };
      list.sort(by[state.sort] || by.name);

      $$('.option', catList).forEach((c) => c.classList.toggle('is-active', c.dataset.cat === state.category));
      $$('#originSeg button').forEach((b) => b.classList.toggle('is-active', b.dataset.origin === state.origin));
      // 10 per page
      const pages = Math.max(1, Math.ceil(list.length / PER_PAGE));
      state.page = Math.min(state.page, pages);
      const pageItems = list.slice((state.page - 1) * PER_PAGE, state.page * PER_PAGE);
      grid.innerHTML = pageItems.map(card).join('');
      renderPager($('#speciesPager'), list.length, state.page, (n) => { state.page = n; render(); scrollToList(grid); }, 'species');

      $('#emptyState').hidden = list.length > 0;
      if (!all.length) {
        $('#emptyTitle').textContent = 'No species recorded yet';
        $('#emptyText').textContent = 'Our team is adding the flowers and plants gathered on Siargao Island. Check back soon.';
        $('#emptyReset').hidden = true;
      }
      $('#resultCount').innerHTML = `<b>${list.length}</b> of ${`${all.length} species`}`;

      const chips = [];
      if (state.q) chips.push(['q', `“${state.q}”`]);
      if (state.category) chips.push(['category', state.category]);
      if (state.municipality) chips.push(['municipality', state.municipality]);
      if (state.origin) chips.push(['origin', state.origin === 'native' ? 'Native' : 'Introduced']);
      $('#activeFilters').innerHTML = chips.map(([k, l]) => `<button type="button" class="filter-chip" data-clear="${k}">${esc(l)} <span>×</span></button>`).join('');

      const p = new URLSearchParams();
      Object.entries(state).forEach(([k, v]) => { if (v && !(k === 'sort' && v === 'name') && !(k === 'page' && v === 1)) p.set(k, v); });
      history.replaceState(null, '', p.toString() ? `?${p}` : location.pathname);
      observeReveal(grid);
    }

    const reset = () => {
      Object.assign(state, { q: '', category: '', municipality: '', origin: '', page: 1 });
      q.value = ''; muni.value = ''; render();
    };

    // any filter change goes back to page 1
    let t;
    q.addEventListener('input', () => { clearTimeout(t); t = setTimeout(() => { state.q = q.value; state.page = 1; render(); }, 150); });
    muni.addEventListener('change', () => { state.municipality = muni.value; state.page = 1; render(); });
    sort.addEventListener('change', () => { state.sort = sort.value; state.page = 1; render(); });
    catList.addEventListener('click', (e) => { const b = e.target.closest('.option'); if (b) { state.category = b.dataset.cat; state.page = 1; render(); } });
    $('#originSeg').addEventListener('click', (e) => { const b = e.target.closest('button'); if (b) { state.origin = b.dataset.origin; state.page = 1; render(); } });
    $('#activeFilters').addEventListener('click', (e) => {
      const b = e.target.closest('[data-clear]'); if (!b) return;
      state[b.dataset.clear] = '';
      state.page = 1;
      if (b.dataset.clear === 'q') q.value = '';
      if (b.dataset.clear === 'municipality') muni.value = '';
      render();
    });
    $('#resetFilters').addEventListener('click', reset);
    $('#emptyReset').addEventListener('click', reset);
    $$('.view-toggle button').forEach((b) => b.addEventListener('click', () => setView(b.dataset.view)));
    $('#filtersToggle').addEventListener('click', () => $('#filters').classList.toggle('is-open'));

    setView(view);
    render();
  }

  /* ---------- SPECIES DETAIL ---------- */
  async function species() {
    const root = $('#speciesPage');
    const id = root.dataset.id;
    const [sp, all] = await Promise.all([id ? API.getSpeciesById(id) : null, API.getSpecies()]);

    if (!sp) {
      root.innerHTML = `<section class="page-header"><div class="container notfound">
        <div class="empty__icon"><svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg></div>
        <h1 class="page-title">Species not found</h1>
        <p class="page-lead">This species isn’t in our field guide yet — it may still be in the field notebook.</p>
        <a class="btn btn--dark" href="explore.php">Browse all species <span aria-hidden="true">→</span></a></div></section>`;
      return;
    }

    document.title = `${sp.local_name} (${sp.scientific_name}) — Siargao Flora`;
    const photos = sp.photos && sp.photos.length ? sp.photos : [{ src: '', caption: '' }];
    const related = all.filter((s) => s.id !== sp.id && s.category === sp.category)
      .concat(all.filter((s) => s.id !== sp.id && s.category !== sp.category)).slice(0, 4);
    const facts = [
      ['Local name', esc(sp.local_name)], ['Common name', esc(sp.common_name)],
      ['Scientific name', `<i>${esc(sp.scientific_name)}</i>`], ['Family', esc(sp.family)],
      ['Plant group', esc(sp.category)], ['Origin', esc(sp.origin || (sp.native ? 'Native to Asia' : 'Introduced'))],
      ['Blooming', esc(sp.blooming)], ['Habitat', esc(sp.habitat)],
    ].filter(([, v]) => v && v !== 'null');

    root.innerHTML = `
      <section class="detail">
        <div class="container">
          <nav class="crumbs" aria-label="Breadcrumb"><a href="index.php">Home</a><span>/</span><a href="explore.php">Species</a><span>/</span><a href="explore.php?category=${encodeURIComponent(sp.category)}">${esc(sp.category)}</a><span>/</span><span>${esc(sp.local_name)}</span></nav>
          <div class="detail__grid">
            <div class="detail__visual">
              <div class="detail__main" id="mainMedia">${media(sp, 0)}</div>
              ${photos.length > 1 ? `<div class="thumbs" id="thumbs">${photos.map((p, i) => `<button type="button" class="${i ? '' : 'is-active'}" data-i="${i}">${media(sp, i, { plain: true })}</button>`).join('')}</div>` : ''}
              ${photos[0].caption ? `<p class="caption" id="mainCaption">${esc(photos[0].caption)}</p>` : ''}
            </div>

            <div class="detail__info">
              <div class="detail__badges"><span class="badge badge--neutral">${icon(sp.category)}${esc(sp.category)}</span>${statusBadge(sp)}</div>
              <h1 class="detail__name">${esc(sp.local_name)}</h1>
              <p class="detail__sci"><i>${esc(sp.scientific_name)}</i> · ${esc(sp.common_name)}</p>
              <p class="detail__desc">${esc(sp.description)}</p>

              <div class="panel">
                <h2 class="panel__title">Quick facts</h2>
                <dl class="facts">${facts.map(([k, v]) => `<div><dt>${k}</dt><dd>${v}</dd></div>`).join('')}</dl>
              </div>

              <div class="panel">
                <h2 class="panel__title">Uses &amp; significance</h2>
                <p>${esc(sp.uses)}</p>
              </div>

              <div class="panel">
                <h2 class="panel__title">Recorded in</h2>
                <div class="tags">${(sp.municipalities || []).map((m) => `<a class="tag" href="explore.php?municipality=${encodeURIComponent(m)}"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 21s-7-6.2-7-11.5A7 7 0 0 1 19 9.5C19 14.8 12 21 12 21z"/><circle cx="12" cy="9.5" r="2.5"/></svg>${esc(m)}</a>`).join('')}</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      ${(sp.videos || []).length ? `
      <section class="section section--dark">
        <div class="container">
          <div class="section__head section__head--light"><div><span class="kicker kicker--light">Field footage</span><h2 class="h2">${esc(sp.local_name)} on video</h2></div></div>
          <div class="detail-videos">${sp.videos.map((v) => videoBlock(sp, v)).join('')}</div>
        </div>
      </section>` : ''}

      <section class="section section--alt">
        <div class="container">
          <div class="section__head"><div><span class="kicker">Keep exploring</span><h2 class="h2">Related species</h2></div>
            <a href="explore.php" class="btn btn--outline">All species <span aria-hidden="true">→</span></a></div>
          <div class="card-grid card-grid--4">${related.map(card).join('')}</div>
        </div>
      </section>`;

    $('#thumbs')?.addEventListener('click', (e) => {
      const b = e.target.closest('button'); if (!b) return;
      const i = Number(b.dataset.i);
      $('#mainMedia').innerHTML = media(sp, i);
      if ($('#mainCaption')) $('#mainCaption').textContent = photos[i].caption || '';
      $$('#thumbs button').forEach((x) => x.classList.toggle('is-active', x === b));
    });
    wireVideos(root);
    autoplayOnScroll(root);
    observeReveal(root);
  }

  /* ---------- GALLERY ---------- */
  async function gallery() {
    const [all, videos] = await Promise.all([API.getSpecies(), API.getVideos()]);
    const items = [
      ...videos.map((v) => ({ type: 'video', sp: v.species || GENERAL, v })),
      ...all.flatMap((sp) => (sp.photos || []).map((p, i) => ({ type: 'photo', sp, p, i }))),
    ];
    const grid = $('#masonry');
    const lb = $('#lightbox'), stage = $('#lightboxStage'), info = $('#lightboxInfo');
    const fullSpecies = (sp) => all.find((s) => s.id === sp.id) || sp;
    let list = [], current = 0;

    /** Right-hand (or lower, on phones) information panel for one gallery item. */
    function infoPanel(it) {
      if (it.sp === GENERAL) {
        return `
          <div class="vi-badges"><span class="badge badge--neutral">▶ Field footage</span></div>
          <h2 class="vi-name">${esc(it.v.title)}</h2>
          <p class="vi-desc">${esc(it.v.description || 'General footage recorded during our data gathering on Siargao Island.')}</p>
          <p class="vi-note">This clip shows several plants and isn’t tied to a single species in the field guide.</p>
          <div class="vi-actions"><a class="btn btn--dark" href="explore.php">Browse all species <span aria-hidden="true">→</span></a></div>`;
      }
      const sp = fullSpecies(it.sp);
      const caption = it.type === 'photo' ? it.p.caption : it.v.title;
      const facts = [
        ['Family', sp.family], ['Origin', sp.origin || (sp.native === undefined ? '' : sp.native ? 'Native to Asia' : 'Introduced')],
        ['Blooming', sp.blooming], ['Habitat', sp.habitat],
      ].filter(([, v]) => v);
      return `
        <div class="vi-badges"><span class="badge badge--neutral">${icon(sp.category)}${esc(sp.category)}</span>${sp.status ? statusBadge(sp) : ''}</div>
        <h2 class="vi-name">${esc(sp.local_name)}</h2>
        <p class="vi-sci"><i>${esc(sp.scientific_name)}</i>${sp.common_name ? ` · ${esc(sp.common_name)}` : ''}</p>
        ${caption ? `<p class="vi-caption">${it.type === 'photo'
          ? '<svg viewBox="0 0 24 24"><path d="M4 8h3l2-3h6l2 3h3v11H4z"/><circle cx="12" cy="13" r="3.5"/></svg>'
          : '<svg viewBox="0 0 24 24"><rect x="3" y="5" width="18" height="14" rx="3"/><path d="m10 9 5 3-5 3z"/></svg>'}${esc(caption)}</p>` : ''}
        ${sp.description ? `<p class="vi-desc">${esc(sp.description)}</p>` : ''}
        ${facts.length ? `<dl class="vi-facts">${facts.map(([k, v]) => `<div><dt>${k}</dt><dd>${esc(v)}</dd></div>`).join('')}</dl>` : ''}
        ${(sp.municipalities || []).length ? `<div class="vi-block"><h3>Recorded in</h3><div class="tags">${sp.municipalities.map((m) => `<a class="tag" href="explore.php?municipality=${encodeURIComponent(m)}"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 21s-7-6.2-7-11.5A7 7 0 0 1 19 9.5C19 14.8 12 21 12 21z"/><circle cx="12" cy="9.5" r="2.5"/></svg>${esc(m)}</a>`).join('')}</div></div>` : ''}
        ${sp.uses ? `<div class="vi-block"><h3>Uses</h3><p>${esc(sp.uses)}</p></div>` : ''}
        <div class="vi-actions"><a class="btn btn--dark" href="${speciesUrl(sp)}">View full details <span aria-hidden="true">→</span></a></div>`;
    }

    function show(n) {
      current = (n + list.length) % list.length;
      const it = list[current];
      stage.innerHTML = it.type === 'photo' ? media(it.sp, it.i, { cls: 'media--contain', plain: true }) : videoBlock(it.sp, it.v);
      wireVideos(stage);
      const box = stage.querySelector('.vid[data-src]');
      if (box) startVideo(box);
      info.innerHTML = `<div class="vi-inner">${infoPanel(it)}</div>`;
      info.scrollTop = 0;
      $('#lbCount').textContent = `${current + 1} / ${list.length}`;
      const multi = list.length > 1;
      $('#lbPrev').hidden = !multi; $('#lbNext').hidden = !multi;
    }

    function open(n) {
      show(n);
      lb.hidden = false;
      document.body.style.overflow = 'hidden';
      requestAnimationFrame(() => lb.classList.add('is-open'));
      $('#lightboxClose').focus({ preventScroll: true });
    }

    let filter = 'all', page = 1;
    function render(newFilter = filter, newPage = 1) {
      filter = newFilter;
      list = items.filter((it) => filter === 'all' || it.type === filter);
      const pages = Math.max(1, Math.ceil(list.length / PER_PAGE));
      page = Math.min(Math.max(1, newPage), pages);
      const start = (page - 1) * PER_PAGE;
      renderPager($('#galleryPager'), list.length, page, (n) => { render(filter, n); scrollToList(grid); },
        filter === 'video' ? 'videos' : filter === 'photo' ? 'photos' : 'items');
      if (!list.length) {
        grid.innerHTML = emptyBlock(filter === 'video' ? 'No videos yet' : 'No photos yet',
          'Photos and videos appear here as our team adds species gathered on Siargao Island.');
        $$('#mediaTabs button').forEach((c) => c.classList.toggle('is-active', c.dataset.media === filter));
        return;
      }
      // data-n is the item's position in the whole filtered list, so the viewer's arrows can cross pages
      grid.innerHTML = list.slice(start, start + PER_PAGE).map((it, k) => ({ it, n: start + k })).map(({ it, n }) => `
        <button type="button" class="m-item reveal ${n % 4 === 1 ? 'tall' : ''}" data-n="${n}">
          ${it.type === 'photo' ? media(it.sp, it.i, { plain: true }) : `<div class="media">${videoCover(it.sp, it.v, 'is-loaded')}</div><span class="m-play"><svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg></span>`}
          <span class="m-cap"><b>${esc(it.sp === GENERAL ? it.v.title : it.sp.local_name)}</b><span>${esc(it.type === 'photo' ? it.p.caption || '' : it.sp === GENERAL ? it.v.description || '' : it.v.title)}</span></span>
        </button>`).join('');
      $$('#mediaTabs button').forEach((c) => c.classList.toggle('is-active', c.dataset.media === filter));
      observeReveal(grid);
    }

    grid.addEventListener('click', (e) => {
      const b = e.target.closest('.m-item'); if (b) open(Number(b.dataset.n));
    });
    const close = () => {
      lb.classList.remove('is-open');
      stage.innerHTML = '';
      lb.hidden = true;
      document.body.style.overflow = '';
    };
    $('#lightboxClose').addEventListener('click', close);
    $('#lbPrev').addEventListener('click', () => show(current - 1));
    $('#lbNext').addEventListener('click', () => show(current + 1));
    lb.addEventListener('click', (e) => { if (e.target === lb) close(); });
    document.addEventListener('keydown', (e) => {
      if (lb.hidden) return;
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowLeft') show(current - 1);
      if (e.key === 'ArrowRight') show(current + 1);
    });
    // swipe left/right on the picture (phones)
    let touchX = null;
    $('.viewer__media').addEventListener('touchstart', (e) => { touchX = e.touches[0].clientX; }, { passive: true });
    $('.viewer__media').addEventListener('touchend', (e) => {
      if (touchX === null) return;
      const dx = e.changedTouches[0].clientX - touchX; touchX = null;
      if (Math.abs(dx) > 50) show(current + (dx < 0 ? 1 : -1));
    });

    $('#mediaTabs').addEventListener('click', (e) => { const b = e.target.closest('button'); if (b) render(b.dataset.media, 1); });
    const t = new URLSearchParams(location.search).get('type');
    render(t === 'video' || t === 'photo' ? t : 'all');
  }

  /* ---------- ABOUT ---------- */
  async function about() {
    const all = await API.getSpecies();
    const artSpecies = all.length ? all.slice(0, 4) : ['Ornamental', 'Vegetable', 'Herb', 'Ornamental'].map((c, i) =>
      ({ id: 'about-' + c, category: c, color: ['#d8342b', '#3f6b3a', '#c4669c', '#7f9a3e'][i], local_name: c }));
    $('#aboutArt').innerHTML = artSpecies.map((sp) => `<div>${media(sp, 0, { plain: true })}</div>`).join('');
    const live = API.source() === 'api';
    $('#apiStatus').innerHTML = `<span class="status-dot ${live ? 'is-live' : ''}"></span>${live
      ? 'Connected — this website is reading live data from the REST API.'
      : 'In development — the website is currently showing sample records.'}`;

    // live API tester (GET only)
    const form = $('#testerForm'), input = $('#testerUrl'), out = $('#testerOut'), meta = $('#testerMeta');
    if (!form) return;
    const send = async () => {
      const url = input.value.trim().replace(/^\//, '');
      if (!/^api\//.test(url)) { meta.innerHTML = '<span class="apilog__status is-err">Only api/… addresses can be tested here.</span>'; return; }
      meta.textContent = 'Sending…';
      const t0 = performance.now();
      try {
        const res = await fetch(url, { headers: { Accept: 'application/json' } });
        const text = await res.text();
        const ms = Math.round(performance.now() - t0);
        let pretty = text;
        try { pretty = JSON.stringify(JSON.parse(text), null, 2); } catch (e) { /* not JSON */ }
        meta.innerHTML = `<span class="apilog__status ${res.ok ? 'is-ok' : 'is-err'}">${res.status} ${esc(res.statusText)}</span>
          <span>${ms} ms</span><span>${(text.length / 1024).toFixed(1)} KB</span><span>${esc(res.headers.get('Content-Type') || '')}</span>`;
        out.textContent = pretty;
      } catch (e) {
        meta.innerHTML = '<span class="apilog__status is-err">Network error</span> Is Apache running?';
        out.textContent = '';
      }
    };
    form.addEventListener('submit', (e) => { e.preventDefault(); send(); });
    $('#testerPresets').addEventListener('click', (e) => {
      const b = e.target.closest('button[data-url]'); if (!b) return;
      $$('#testerPresets button').forEach((x) => x.classList.toggle('is-active', x === b));
      input.value = b.dataset.url;
      send();
    });
  }

  /* ---------- boot ---------- */
  document.addEventListener('DOMContentLoaded', () => {
    initNav();
    const pages = { home, explore, species, gallery, about };
    const fn = $('#speciesPage') ? species : pages[document.body.dataset.page];
    if (fn) fn().catch((err) => console.error('[Siargao Flora]', err));
  });
})();

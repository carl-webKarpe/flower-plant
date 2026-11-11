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

  /** A video block that tries the real clip and shows a friendly message if it isn't uploaded yet. */
  function videoBlock(sp, video) {
    const yt = youtubeId(video.src || '');
    if (yt) {
      return `<div class="vid"><iframe src="https://www.youtube-nocookie.com/embed/${yt}" title="${esc(video.title)}" allow="autoplay; encrypted-media; picture-in-picture" allowfullscreen></iframe></div>`;
    }
    return `
      <div class="vid" data-src="${esc(videoSrc(video.src))}">
        <div class="vid__poster">${Art.svg(sp, { variant: 3, plain: true })}
          <button class="vid__play" type="button" aria-label="Play ${esc(video.title)}"><svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg></button>
          <div class="vid__meta"><b>${esc(video.title)}</b><span>${esc(sp.local_name)} · ${esc(sp.scientific_name)}</span></div>
        </div>
      </div>`;
  }

  function wireVideos(root = document) {
    $$('.vid[data-src] .vid__play', root).forEach((btn) => {
      btn.addEventListener('click', () => {
        const box = btn.closest('.vid');
        const v = document.createElement('video');
        v.src = box.dataset.src; v.controls = true; v.autoplay = true; v.playsInline = true;
        v.addEventListener('error', () => {
          v.remove();
          btn.outerHTML = '<p class="vid__missing">This clip is still being uploaded from the field.</p>';
        });
        v.addEventListener('loadeddata', () => box.querySelector('.vid__poster')?.remove());
        box.appendChild(v);
      });
    });
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

  /* ---------- HOME ---------- */
  async function home() {
    const [species, categories, munis] = await Promise.all([API.getSpecies(), API.getCategories(), API.getMunicipalities()]);

    $('#heroCategory').insertAdjacentHTML('beforeend', categories.map((c) => `<option>${esc(c.name)}</option>`).join(''));

    // featured rotator
    const featured = species.filter((s) => s.category !== 'Palm').slice(0, 8);
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

    // stats
    const stats = {
      species: species.length,
      municipalities: new Set(species.flatMap((s) => s.municipalities || [])).size,
      categories: new Set(species.map((s) => s.category)).size,
      videos: species.reduce((n, s) => n + (s.videos || []).length, 0),
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
      grid.innerHTML = list.map(card).join('');
      observeReveal(grid);
    };
    tabs.addEventListener('click', (e) => {
      const b = e.target.closest('button'); if (!b) return;
      $$('button', tabs).forEach((x) => x.classList.toggle('is-active', x === b));
      showFeatured(b.dataset.cat);
    });
    showFeatured('All');

    // plant groups (bento)
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
    const vids = species.flatMap((sp) => (sp.videos || []).map((v) => ({ sp, v })));
    const player = $('#videoPlayer'), vlist = $('#videoList');
    const play = (i) => {
      player.innerHTML = videoBlock(vids[i].sp, vids[i].v);
      wireVideos(player);
      $$('li', vlist).forEach((li, j) => li.classList.toggle('is-active', i === j));
    };
    if (vids.length) {
      vlist.innerHTML = vids.map(({ sp, v }, i) => `<li><button type="button" data-i="${i}">
          <span class="vl-thumb">${Art.svg(sp, { variant: 3, plain: true })}<i>▶</i></span>
          <span class="vl-text"><b>${esc(v.title)}</b><small>${esc(sp.local_name)} · <em>${esc(sp.scientific_name)}</em></small></span>
        </button></li>`).join('');
      $$('button', vlist).forEach((b) => b.addEventListener('click', () => play(Number(b.dataset.i))));
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
      grid.innerHTML = list.map(card).join('');
      $('#emptyState').hidden = list.length > 0;
      $('#resultCount').innerHTML = `<b>${list.length}</b> of ${`${all.length} species`}`;

      const chips = [];
      if (state.q) chips.push(['q', `“${state.q}”`]);
      if (state.category) chips.push(['category', state.category]);
      if (state.municipality) chips.push(['municipality', state.municipality]);
      if (state.origin) chips.push(['origin', state.origin === 'native' ? 'Native' : 'Introduced']);
      $('#activeFilters').innerHTML = chips.map(([k, l]) => `<button type="button" class="filter-chip" data-clear="${k}">${esc(l)} <span>×</span></button>`).join('');

      const p = new URLSearchParams();
      Object.entries(state).forEach(([k, v]) => { if (v && !(k === 'sort' && v === 'name')) p.set(k, v); });
      history.replaceState(null, '', p.toString() ? `?${p}` : location.pathname);
      observeReveal(grid);
    }

    const reset = () => {
      Object.assign(state, { q: '', category: '', municipality: '', origin: '' });
      q.value = ''; muni.value = ''; render();
    };

    let t;
    q.addEventListener('input', () => { clearTimeout(t); t = setTimeout(() => { state.q = q.value; render(); }, 150); });
    muni.addEventListener('change', () => { state.municipality = muni.value; render(); });
    sort.addEventListener('change', () => { state.sort = sort.value; render(); });
    catList.addEventListener('click', (e) => { const b = e.target.closest('.option'); if (b) { state.category = b.dataset.cat; render(); } });
    $('#originSeg').addEventListener('click', (e) => { const b = e.target.closest('button'); if (b) { state.origin = b.dataset.origin; render(); } });
    $('#activeFilters').addEventListener('click', (e) => {
      const b = e.target.closest('[data-clear]'); if (!b) return;
      state[b.dataset.clear] = '';
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
      ['Plant group', esc(sp.category)], ['Origin', sp.native ? 'Native to the Philippines' : 'Introduced / cultivated'],
      ['Blooming', esc(sp.blooming)], ['Habitat', esc(sp.habitat)],
    ];

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
    observeReveal(root);
  }

  /* ---------- GALLERY ---------- */
  async function gallery() {
    const all = await API.getSpecies();
    const items = all.flatMap((sp) => [
      ...(sp.photos || []).map((p, i) => ({ type: 'photo', sp, p, i })),
      ...(sp.videos || []).map((v) => ({ type: 'video', sp, v })),
    ]);
    const grid = $('#masonry');
    const lb = $('#lightbox'), stage = $('#lightboxStage'), cap = $('#lightboxCaption');

    function render(filter) {
      const list = items.filter((it) => filter === 'all' || it.type === filter);
      grid.innerHTML = list.map((it, n) => `
        <button type="button" class="m-item reveal ${n % 4 === 1 ? 'tall' : ''}" data-n="${items.indexOf(it)}">
          ${it.type === 'photo' ? media(it.sp, it.i, { plain: true }) : `<div class="media">${Art.svg(it.sp, { variant: 3, plain: true })}</div><span class="m-play"><svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg></span>`}
          <span class="m-cap"><b>${esc(it.sp.local_name)}</b><span>${esc(it.type === 'photo' ? it.p.caption || '' : it.v.title)}</span></span>
        </button>`).join('');
      $$('#mediaTabs button').forEach((c) => c.classList.toggle('is-active', c.dataset.media === filter));
      observeReveal(grid);
    }

    grid.addEventListener('click', (e) => {
      const b = e.target.closest('.m-item'); if (!b) return;
      const it = items[Number(b.dataset.n)];
      stage.innerHTML = it.type === 'photo' ? media(it.sp, it.i, { cls: 'media--contain', plain: true }) : videoBlock(it.sp, it.v);
      wireVideos(stage);
      cap.innerHTML = `<div><b>${esc(it.sp.local_name)}</b> <i>${esc(it.sp.scientific_name)}</i><span>${esc(it.type === 'photo' ? it.p.caption || '' : it.v.title)}</span></div><a href="${speciesUrl(it.sp)}" class="btn btn--accent btn--sm">View species →</a>`;
      lb.hidden = false; document.body.style.overflow = 'hidden';
    });
    const close = () => { lb.hidden = true; stage.innerHTML = ''; document.body.style.overflow = ''; };
    $('#lightboxClose').addEventListener('click', close);
    lb.addEventListener('click', (e) => { if (e.target === lb) close(); });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && !lb.hidden) close(); });

    $('#mediaTabs').addEventListener('click', (e) => { const b = e.target.closest('button'); if (b) render(b.dataset.media); });
    const t = new URLSearchParams(location.search).get('type');
    render(t === 'video' || t === 'photo' ? t : 'all');
  }

  /* ---------- ABOUT ---------- */
  async function about() {
    const all = await API.getSpecies();
    $('#aboutArt').innerHTML = all.slice(0, 4).map((sp) => `<div>${media(sp, 0, { plain: true })}</div>`).join('');
    const live = API.source() === 'api';
    $('#apiStatus').innerHTML = `<span class="status-dot ${live ? 'is-live' : ''}"></span>${live
      ? 'Connected — this website is reading live data from the REST API.'
      : 'In development — the website is currently showing sample records.'}`;
  }

  /* ---------- boot ---------- */
  document.addEventListener('DOMContentLoaded', () => {
    initNav();
    const pages = { home, explore, species, gallery, about };
    const fn = $('#speciesPage') ? species : pages[document.body.dataset.page];
    if (fn) fn().catch((err) => console.error('[Siargao Flora]', err));
  });
})();

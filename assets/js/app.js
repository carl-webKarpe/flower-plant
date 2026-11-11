/* Lunhaw — front-end rendering. All data comes through window.LunhawAPI. */
(function () {
  const cfg = window.LUNHAW_CONFIG;
  const API = window.LunhawAPI;
  const Art = window.LunhawArt;

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

  /** Illustrated art with the real photo layered on top; a missing photo simply leaves the art visible. */
  function media(sp, photoIndex = 0, opts = {}) {
    const photo = (sp.photos || [])[photoIndex];
    const img = photo
      ? `<img src="${esc(photoSrc(photo.src))}" alt="${esc(photo.caption || sp.local_name)}" loading="lazy"
           onload="this.classList.add('is-loaded')" onerror="this.remove()">`
      : '';
    return `<div class="media ${opts.cls || ''}">${Art.svg(sp, { variant: photoIndex })}${img}</div>`;
  }

  function statusBadge(sp) {
    const tone = /endangered|vulnerable|critical/i.test(sp.status) ? 'warn' : sp.native ? 'native' : '';
    return `<span class="badge ${tone}">${esc(sp.status || (sp.native ? 'Native' : 'Introduced'))}</span>`;
  }

  function card(sp, i = 0) {
    return `
      <a class="card reveal" href="${speciesUrl(sp)}" style="--d:${(i % 6) * 60}ms">
        ${media(sp, 0, { cls: 'card__media' })}
        <div class="card__top">
          <span class="badge badge--glass">${esc(sp.category)}</span>
          ${(sp.videos || []).length ? '<span class="badge badge--glass" title="Has video">▶ Video</span>' : ''}
        </div>
        <div class="card__body">
          <div>
            <h3>${esc(sp.local_name)}</h3>
            <p class="sci">${esc(sp.scientific_name)}</p>
          </div>
          <span class="card__arrow" aria-hidden="true">↗</span>
        </div>
        <p class="card__meta">${esc((sp.municipalities || []).slice(0, 3).join(' · '))}${(sp.municipalities || []).length > 3 ? ' +' + (sp.municipalities.length - 3) : ''}</p>
      </a>`;
  }

  function observeReveal(root = document) {
    const els = $$('.reveal:not(.is-in)', root);
    if (!('IntersectionObserver' in window)) { els.forEach((e) => e.classList.add('is-in')); return; }
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => { if (en.isIntersecting) { en.target.classList.add('is-in'); io.unobserve(en.target); } });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    els.forEach((e) => io.observe(e));
  }

  function countUp(el, to) {
    const dur = 1200, start = performance.now();
    const step = (t) => {
      const p = Math.min(1, (t - start) / dur);
      el.textContent = Math.round(to * (1 - Math.pow(1 - p, 3)));
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }

  /** A video block that tries the real clip and shows a friendly placeholder if it isn't uploaded yet. */
  function videoBlock(sp, video, { autoplay = false } = {}) {
    const yt = youtubeId(video.src || '');
    if (yt) {
      return `<div class="vid"><iframe src="https://www.youtube-nocookie.com/embed/${yt}${autoplay ? '?autoplay=1' : ''}" title="${esc(video.title)}" allow="autoplay; encrypted-media; picture-in-picture" allowfullscreen></iframe></div>`;
    }
    return `
      <div class="vid" data-src="${esc(videoSrc(video.src))}">
        <div class="vid__poster">${Art.svg(sp, { variant: 3 })}
          <button class="vid__play" aria-label="Play ${esc(video.title)}"><span>▶</span></button>
          <p class="vid__title">${esc(video.title)}</p>
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
          box.querySelector('.vid__poster').classList.add('is-missing');
          v.remove();
          btn.outerHTML = '<p class="vid__missing">This clip is still being uploaded from the field.</p>';
        });
        box.appendChild(v);
        v.addEventListener('loadeddata', () => box.querySelector('.vid__poster')?.remove());
      });
    });
  }

  /* ---------- navigation ---------- */
  function initNav() {
    const nav = $('#nav'), toggle = $('#navToggle');
    const onScroll = () => nav.classList.toggle('is-scrolled', window.scrollY > 30);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    toggle.addEventListener('click', () => {
      const open = nav.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', open);
    });
  }

  /* ---------- HOME ---------- */
  async function home() {
    const [species, categories, munis] = await Promise.all([API.getSpecies(), API.getCategories(), API.getMunicipalities()]);

    // hero specimen rotator
    const featured = species.filter((s) => s.category !== 'Palm').slice(0, 8);
    let idx = 0;
    const showSpecimen = () => {
      const sp = featured[idx % featured.length];
      $('#heroSpecimenMedia').innerHTML = media(sp);
      $('#heroSpecimenTag').textContent = `No. ${pad((idx % featured.length) + 1)} · ${sp.category}`;
      $('#heroSpecimenName').textContent = sp.local_name;
      $('#heroSpecimenSci').textContent = sp.scientific_name;
      const card = $('#heroSpecimen');
      card.onclick = () => (location.href = speciesUrl(sp));
      const bar = $('#heroSpecimenBar');
      bar.style.transition = 'none'; bar.style.width = '0';
      requestAnimationFrame(() => requestAnimationFrame(() => { bar.style.transition = 'width 5s linear'; bar.style.width = '100%'; }));
      idx++;
    };
    if (featured.length) { showSpecimen(); setInterval(showSpecimen, 5000); }

    // statement pill images
    $$('.pill-img').forEach((el) => {
      const sp = species.find((s) => s.id === el.dataset.slug) || species[0];
      if (sp) el.innerHTML = media(sp);
    });

    // stats
    const used = new Set(species.flatMap((s) => s.municipalities || []));
    const stats = {
      species: species.length,
      municipalities: used.size,
      categories: new Set(species.map((s) => s.category)).size,
      endemic: species.filter((s) => s.native).length,
    };
    $$('[data-stat]').forEach((el) => (el.textContent = stats[el.dataset.stat]));
    const statIO = new IntersectionObserver((en) => {
      if (en[0].isIntersecting) { $$('[data-stat]').forEach((el) => countUp(el, stats[el.dataset.stat])); statIO.disconnect(); }
    });
    statIO.observe($('#stats'));

    // specimen index list with cursor preview
    const list = $('#indexList'), preview = $('#indexPreview');
    list.innerHTML = species.slice(0, 7).map((sp, i) => `
      <li class="reveal" style="--d:${i * 50}ms">
        <a href="${speciesUrl(sp)}" data-id="${esc(sp.id)}">
          <span class="idx">${pad(i + 1)}</span>
          <span class="idx-name">${esc(sp.local_name)}</span>
          <span class="idx-sci">${esc(sp.scientific_name)}</span>
          <span class="idx-cat">${esc(sp.category)}</span>
          <span class="idx-arrow">→</span>
        </a>
      </li>`).join('');
    const byId = Object.fromEntries(species.map((s) => [s.id, s]));
    $$('a', list).forEach((a) => {
      a.addEventListener('mouseenter', () => { preview.innerHTML = media(byId[a.dataset.id]); preview.classList.add('is-on'); });
      a.addEventListener('mouseleave', () => preview.classList.remove('is-on'));
    });
    list.addEventListener('mousemove', (e) => {
      preview.style.transform = `translate(${e.clientX + 24}px, ${e.clientY - 120}px) rotate(-4deg)`;
    });

    // categories
    $('#categoryGrid').innerHTML = categories.map((c, i) => {
      const inCat = species.filter((s) => s.category === c.name);
      const rep = inCat[0] || { id: c.name, category: c.name, color: '#5b8a4a' };
      return `<a class="cat reveal" style="--d:${i * 60}ms" href="explore.php?category=${encodeURIComponent(c.name)}">
          <div class="cat__art">${Art.svg(rep, { variant: 7, plain: true })}</div>
          <div class="cat__text"><h3>${esc(c.name)}</h3><p>${esc(c.blurb || '')}</p></div>
          <span class="cat__count">${pad(inCat.length)}</span>
        </a>`;
    }).join('');

    // field scroller
    const scroller = $('#fieldScroller');
    scroller.innerHTML = species.map((sp) => `
      <a class="field-item" href="${speciesUrl(sp)}">
        ${media(sp)}
        <div class="field-item__cap"><b>${esc(sp.local_name)}</b><span>${esc((sp.photos?.[0]?.caption) || sp.municipalities?.[0] || '')}</span></div>
      </a>`).join('');
    $$('[data-scroll]').forEach((b) => b.addEventListener('click', () =>
      scroller.scrollBy({ left: Number(b.dataset.scroll) * scroller.clientWidth * 0.7, behavior: 'smooth' })));

    // videos
    const vids = species.flatMap((sp) => (sp.videos || []).map((v) => ({ sp, v })));
    const player = $('#videoPlayer'), vlist = $('#videoList');
    const play = (i) => {
      player.innerHTML = videoBlock(vids[i].sp, vids[i].v);
      wireVideos(player);
      $$('li', vlist).forEach((li, j) => li.classList.toggle('is-active', i === j));
    };
    if (vids.length) {
      vlist.innerHTML = vids.map(({ sp, v }, i) => `<li><button data-i="${i}"><span class="vl-n">${pad(i + 1)}</span><span><b>${esc(v.title)}</b><small>${esc(sp.local_name)} · ${esc(sp.scientific_name)}</small></span></button></li>`).join('');
      $$('button', vlist).forEach((b) => b.addEventListener('click', () => play(Number(b.dataset.i))));
      play(0);
    } else {
      player.innerHTML = '<p class="muted-light">Field videos will appear here soon.</p>';
    }

    // municipalities
    $('#muniGrid').innerHTML = munis.map((m, i) => {
      const n = species.filter((s) => (s.municipalities || []).includes(m)).length;
      return `<a class="muni reveal" style="--d:${i * 40}ms" href="explore.php?municipality=${encodeURIComponent(m)}">
        <span class="muni__n">${pad(i + 1)}</span><span class="muni__name">${esc(m)}</span>
        <span class="muni__count">${n} species</span></a>`;
    }).join('');

    // CTA art collage
    $('#ctaArt').innerHTML = species.slice(0, 3).map((sp, i) => `<div class="cta__tile t${i}">${media(sp)}</div>`).join('');

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
      sort: params.get('sort') || 'name',
    };

    const q = $('#q'), muni = $('#muni'), sort = $('#sort'), chips = $('#categoryChips');
    q.value = state.q; sort.value = state.sort;
    muni.insertAdjacentHTML('beforeend', munis.map((m) => `<option>${esc(m)}</option>`).join(''));
    muni.value = state.municipality;
    chips.innerHTML = ['All', ...categories.map((c) => c.name)].map((n) =>
      `<button class="chip" role="tab" data-cat="${n === 'All' ? '' : esc(n)}">${esc(n)}</button>`).join('');
    $('#emptyArt').innerHTML = Art.svg({ id: 'empty', category: 'Shrub & Vine', color: '#c9e265' }, { plain: true });

    const norm = (s) => String(s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');

    function render() {
      const term = norm(state.q.trim());
      let list = all.filter((sp) =>
        (!state.category || sp.category === state.category) &&
        (!state.municipality || (sp.municipalities || []).includes(state.municipality)) &&
        (!term || [sp.local_name, sp.common_name, sp.scientific_name, sp.family, sp.category].some((f) => norm(f).includes(term))));
      const by = { name: (a, b) => a.local_name.localeCompare(b.local_name),
                   sci: (a, b) => a.scientific_name.localeCompare(b.scientific_name),
                   recent: (a, b) => String(b.date_added).localeCompare(String(a.date_added)) };
      list.sort(by[state.sort] || by.name);

      $$('.chip', chips).forEach((c) => c.classList.toggle('is-active', c.dataset.cat === state.category));
      $('#speciesGrid').innerHTML = list.map(card).join('');
      $('#emptyState').hidden = list.length > 0;
      const filtered = state.q || state.category || state.municipality;
      $('#resetFilters').hidden = !filtered;
      $('#resultCount').innerHTML = `Showing <b>${list.length}</b> of ${all.length} species${state.municipality ? ` in <b>${esc(state.municipality)}</b>` : ''}`;

      const p = new URLSearchParams();
      Object.entries(state).forEach(([k, v]) => { if (v && !(k === 'sort' && v === 'name')) p.set(k, v); });
      history.replaceState(null, '', p.toString() ? `?${p}` : location.pathname);
      observeReveal($('#speciesGrid'));
    }

    let t;
    q.addEventListener('input', () => { clearTimeout(t); t = setTimeout(() => { state.q = q.value; render(); }, 150); });
    muni.addEventListener('change', () => { state.municipality = muni.value; render(); });
    sort.addEventListener('change', () => { state.sort = sort.value; render(); });
    chips.addEventListener('click', (e) => { const b = e.target.closest('.chip'); if (b) { state.category = b.dataset.cat; render(); } });
    $('#resetFilters').addEventListener('click', () => {
      Object.assign(state, { q: '', category: '', municipality: '' }); q.value = ''; muni.value = ''; render();
    });
    render();
  }

  /* ---------- SPECIES DETAIL ---------- */
  async function species() {
    const root = $('#speciesPage');
    const id = root.dataset.id;
    const [sp, all] = await Promise.all([id ? API.getSpeciesById(id) : null, API.getSpecies()]);

    if (!sp) {
      root.innerHTML = `<section class="container page-head notfound">
        <div class="notfound__art">${Art.svg({ id: 'nf', category: 'Flower', color: '#c9e265' }, { plain: true })}</div>
        <div><p class="eyebrow"><span class="dot"></span> Not found</p>
        <h1 class="page-title">We haven’t recorded<br>this <em>one</em> yet.</h1>
        <p class="muted">The species you’re looking for isn’t in our field guide. It may still be in the field notebook.</p>
        <a class="btn btn--dark" href="explore.php">Browse all species <span class="btn__icon">↗</span></a></div></section>`;
      return;
    }

    document.title = `${sp.local_name} (${sp.scientific_name}) — Lunhaw`;
    const photos = sp.photos && sp.photos.length ? sp.photos : [{ src: '', caption: sp.local_name }];
    const related = all.filter((s) => s.id !== sp.id && s.category === sp.category)
      .concat(all.filter((s) => s.id !== sp.id && s.category !== sp.category)).slice(0, 3);
    const facts = [
      ['Local name', sp.local_name], ['Common name', sp.common_name], ['Scientific name', `<i>${esc(sp.scientific_name)}</i>`],
      ['Family', sp.family], ['Group', sp.category], ['Origin', sp.native ? 'Native to the Philippines' : 'Introduced / cultivated'],
      ['Blooming', sp.blooming], ['Habitat', sp.habitat],
    ];

    root.innerHTML = `
      <section class="container detail">
        <nav class="crumbs"><a href="index.php">Home</a><span>/</span><a href="explore.php">Explore</a><span>/</span><a href="explore.php?category=${encodeURIComponent(sp.category)}">${esc(sp.category)}</a></nav>
        <div class="detail__grid">
          <div class="detail__visual">
            <div class="detail__main" id="mainMedia">${media(sp, 0)}</div>
            ${photos.length > 1 ? `<div class="thumbs" id="thumbs">${photos.map((p, i) => `<button class="${i ? '' : 'is-active'}" data-i="${i}">${media(sp, i)}</button>`).join('')}</div>` : ''}
            <p class="caption" id="mainCaption">${esc(photos[0].caption || '')}</p>
          </div>
          <div class="detail__info">
            <div class="detail__badges"><span class="badge">${esc(sp.category)}</span>${statusBadge(sp)}</div>
            <h1 class="detail__name">${esc(sp.local_name)}</h1>
            <p class="detail__sci">${esc(sp.scientific_name)} <span>· ${esc(sp.common_name)}</span></p>
            <p class="detail__desc">${esc(sp.description)}</p>
            <dl class="facts">${facts.map(([k, v]) => `<div><dt>${k}</dt><dd>${k === 'Scientific name' ? v : esc(v)}</dd></div>`).join('')}</dl>
            <div class="detail__block">
              <h3>Uses &amp; significance</h3>
              <p>${esc(sp.uses)}</p>
            </div>
            <div class="detail__block">
              <h3>Recorded in</h3>
              <div class="tags">${(sp.municipalities || []).map((m) => `<a class="tag" href="explore.php?municipality=${encodeURIComponent(m)}">📍 ${esc(m)}</a>`).join('')}</div>
            </div>
          </div>
        </div>
      </section>

      ${(sp.videos || []).length ? `
      <section class="section video-section video-section--compact">
        <div class="container">
          <p class="eyebrow eyebrow--light"><span class="dot"></span> Field footage</p>
          <h2 class="h2 light">${esc(sp.local_name)} on video</h2>
          <div class="detail-videos">${sp.videos.map((v) => videoBlock(sp, v)).join('')}</div>
        </div>
      </section>` : ''}

      <section class="section">
        <div class="container">
          <div class="section__head"><div><p class="eyebrow"><span class="dot"></span> Keep exploring</p><h2 class="h2">Related species</h2></div>
            <a href="explore.php" class="link-arrow">All species →</a></div>
          <div class="card-grid">${related.map(card).join('')}</div>
        </div>
      </section>`;

    $('#thumbs')?.addEventListener('click', (e) => {
      const b = e.target.closest('button'); if (!b) return;
      const i = Number(b.dataset.i);
      $('#mainMedia').innerHTML = media(sp, i);
      $('#mainCaption').textContent = photos[i].caption || '';
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
        <button class="m-item reveal ${n % 3 === 1 ? 'tall' : ''}" data-n="${items.indexOf(it)}">
          ${it.type === 'photo' ? media(it.sp, it.i) : `<div class="media">${Art.svg(it.sp, { variant: 3 })}</div><span class="m-play">▶</span>`}
          <span class="m-cap"><b>${esc(it.sp.local_name)}</b>${esc(it.type === 'photo' ? it.p.caption || '' : it.v.title)}</span>
        </button>`).join('');
      observeReveal(grid);
    }

    grid.addEventListener('click', (e) => {
      const b = e.target.closest('.m-item'); if (!b) return;
      const it = items[Number(b.dataset.n)];
      stage.innerHTML = it.type === 'photo' ? media(it.sp, it.i, { cls: 'media--contain' }) : videoBlock(it.sp, it.v);
      wireVideos(stage);
      cap.innerHTML = `<b>${esc(it.sp.local_name)}</b> <i>${esc(it.sp.scientific_name)}</i> — ${esc(it.type === 'photo' ? it.p.caption || '' : it.v.title)} · <a href="${speciesUrl(it.sp)}">View species →</a>`;
      lb.hidden = false; document.body.style.overflow = 'hidden';
    });
    const close = () => { lb.hidden = true; stage.innerHTML = ''; document.body.style.overflow = ''; };
    $('#lightboxClose').addEventListener('click', close);
    lb.addEventListener('click', (e) => { if (e.target === lb) close(); });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && !lb.hidden) close(); });

    $('#mediaTabs').addEventListener('click', (e) => {
      const b = e.target.closest('.chip'); if (!b) return;
      $$('#mediaTabs .chip').forEach((c) => c.classList.toggle('is-active', c === b));
      render(b.dataset.media);
    });
    render('all');
  }

  /* ---------- ABOUT ---------- */
  async function about() {
    const all = await API.getSpecies();
    $('#aboutArt').innerHTML = all.slice(0, 4).map((sp) => `<div>${media(sp)}</div>`).join('');
    $('#apiStatus').textContent = API.source() === 'api'
      ? 'Status: this website is currently reading live data from the REST API.'
      : 'Status: the API is still in development — the website is showing sample records for now.';
  }

  /* ---------- boot ---------- */
  document.addEventListener('DOMContentLoaded', () => {
    initNav();
    const pages = { home, explore, species, gallery, about };
    const fn = pages[document.body.dataset.page === 'explore' && $('#speciesPage') ? 'species' : document.body.dataset.page];
    if (fn) fn().catch((err) => console.error('[Lunhaw]', err));
  });
})();

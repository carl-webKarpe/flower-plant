/* Siargao Flora — landing page. All content comes from the REST API (window.SiargaoFloraAPI). */
(function () {
  const API = window.SiargaoFloraAPI;
  const cfg = window.LUNHAW_CONFIG;
  const $ = (s) => document.querySelector(s);
  const esc = (v) => String(v ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const photo = (sp) => {
    const src = sp.photos && sp.photos[0] && sp.photos[0].src;
    if (!src) return '';
    return /^(https?:)?\/\//.test(src) || src.includes('/') ? src : cfg.SPECIES_IMAGE_DIR + src;
  };
  const url = (sp) => `species.php?id=${encodeURIComponent(sp.id)}`;

  function countUp(el, to) {
    const start = performance.now();
    const step = (now) => {
      const k = Math.min(1, (now - start) / 1000);
      el.textContent = Math.round(to * (1 - Math.pow(1 - k, 3)));
      if (k < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }

  async function init() {
    const [species, categories, videos] = await Promise.all([API.getSpecies(), API.getCategories(), API.getVideos()]);
    const withPhoto = species.filter(photo);

    // hero headline + stats
    $('#lpCount').textContent = species.length;
    const towns = {};
    species.forEach((s) => (s.municipalities || []).forEach((m) => { towns[m] = (towns[m] || 0) + 1; }));
    const stats = { species: species.length, towns: Object.keys(towns).length, groups: categories.length, videos: videos.length };
    document.querySelectorAll('#lpStats dt').forEach((dt) => countUp(dt, stats[dt.dataset.k]));

    // photo wall: three columns, each list doubled so the drift loops seamlessly
    const cols = [[], [], []];
    withPhoto.forEach((s, i) => cols[i % 3].push(s));
    cols.forEach((list, i) => {
      const tiles = list.map((s) => `<a class="lp-tile" href="${url(s)}" tabindex="-1"><img src="${esc(photo(s))}" alt="" loading="lazy"><span>${esc(s.local_name)}</span></a>`).join('');
      $(`#lpCol${i + 1}`).innerHTML = `<div class="lp-col__track">${tiles}${tiles}</div>`;
    });

    // groups
    $('#lpGroups').innerHTML = categories.map((c) => {
      const inGroup = withPhoto.filter((s) => s.category === c.name);
      const rep = inGroup[0];
      const n = species.filter((s) => s.category === c.name).length;
      return `<a class="lp-group" href="explore.php?category=${encodeURIComponent(c.name)}">
        ${rep ? `<img src="${esc(photo(rep))}" alt="" loading="lazy">` : ''}
        <div class="lp-group__text"><b>${esc(c.name)}</b><span>${n} plant${n === 1 ? '' : 's'}</span></div>
      </a>`;
    }).join('');

    // spotlight carousel
    let idx = Math.floor(Date.now() / 86400000) % Math.max(1, withPhoto.length);
    let timer;
    function show(i) {
      if (!withPhoto.length) return;
      idx = (i + withPhoto.length) % withPhoto.length;
      const s = withPhoto[idx];
      const box = $('#lpSpot');
      box.classList.remove('is-in'); void box.offsetWidth; box.classList.add('is-in');
      $('#lpSpotImg').src = photo(s);
      $('#lpSpotImg').alt = s.local_name;
      $('#lpSpotCap').textContent = (s.photos[0] && s.photos[0].caption) || '';
      $('#lpSpotName').textContent = s.local_name;
      $('#lpSpotSci').innerHTML = `<i>${esc(s.scientific_name)}</i>${s.common_name ? ' · ' + esc(s.common_name) : ''}`;
      $('#lpSpotDesc').textContent = s.description || '';
      $('#lpSpotFacts').innerHTML = [['Group', s.category], ['Family', s.family], ['Origin', s.origin], ['Found in', (s.municipalities || []).join(', ')]]
        .filter(([, v]) => v).map(([k, v]) => `<div><dt>${k}</dt><dd>${esc(v)}</dd></div>`).join('');
      $('#lpSpotLink').href = url(s);
      $('#lpSpotCount').textContent = `${idx + 1} / ${withPhoto.length}`;
      clearTimeout(timer);
      timer = setTimeout(() => show(idx + 1), 8000);
    }
    $('#lpPrev').addEventListener('click', () => show(idx - 1));
    $('#lpNext').addEventListener('click', () => show(idx + 1));
    show(idx);

    // towns, most plants first
    const sorted = Object.entries(towns).sort((a, b) => b[1] - a[1]);
    const max = sorted.length ? sorted[0][1] : 1;
    $('#lpTowns').innerHTML = sorted.map(([m, n]) => `
      <li><a href="explore.php?municipality=${encodeURIComponent(m)}">
        <span class="lp-town__name">${esc(m)}</span>
        <span class="lp-town__bar"><i style="width:${Math.round(n / max * 100)}%"></i></span>
        <span class="lp-town__n">${n}</span>
      </a></li>`).join('');

    // CTA mosaic
    $('#lpMosaic').innerHTML = withPhoto.slice(0, 6).map((s) => `<img src="${esc(photo(s))}" alt="" loading="lazy">`).join('');
  }

  init().catch((e) => console.error('[Siargao Flora landing]', e));
})();

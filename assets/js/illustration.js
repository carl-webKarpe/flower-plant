/**
 * Botanical placeholder art (line-art on a tinted gradient).
 * Shown until the team uploads real field photos, so the layout never displays a broken image.
 */
window.SiargaoFloraArt = (function () {
  function hash(str) {
    let h = 2166136261;
    for (let i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 16777619); }
    return h >>> 0;
  }
  function rng(seed) {
    let s = seed || 1;
    return () => ((s = Math.imul(s ^ (s >>> 15), 2246822507) ^ Math.imul(s ^ (s >>> 13), 3266489909)) >>> 0) / 4294967296;
  }
  function mix(hex, target, amt) {
    const p = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
    const a = p(hex), b = p(target);
    return '#' + a.map((v, i) => Math.round(v + (b[i] - v) * amt).toString(16).padStart(2, '0')).join('');
  }
  const BASE = '#0c1c14';
  const L = 'stroke="#fff" stroke-opacity=".9" stroke-width="1.4" fill="none" stroke-linecap="round" stroke-linejoin="round"';

  const leafPath = (len) =>
    `M0 0 C ${len * 0.35} ${-len * 0.3}, ${len * 0.75} ${-len * 0.24}, ${len} 0 C ${len * 0.75} ${len * 0.24}, ${len * 0.35} ${len * 0.3}, 0 0 Z M0 0 L ${len * 0.92} 0`;
  const leaf = (x, y, len, rot, tint) =>
    `<path transform="translate(${x} ${y}) rotate(${rot})" d="${leafPath(len)}" ${L} ${tint ? `style="fill:${tint}"` : ''}/>`;

  function flower(c, r) {
    const n = 5 + Math.floor(r() * 2);
    let petals = '';
    for (let i = 0; i < n; i++) {
      const a = (360 / n) * i;
      petals += `<path transform="rotate(${a})" d="M0 -6 C 16 -20, 16 -48, 0 -60 C -16 -48, -16 -20, 0 -6 Z" ${L} style="fill:${c};fill-opacity:.35"/>`;
    }
    return `<path d="M100 250 C 98 210, 104 180, 100 135" ${L}/>
      ${leaf(100, 210, 58, -38, 'rgba(255,255,255,.06)')}${leaf(100, 188, 48, -145, 'rgba(255,255,255,.06)')}
      <g transform="translate(100 110)">${petals}
        <circle r="9" ${L} style="fill:${c};fill-opacity:.6"/>
        ${Array.from({ length: 8 }, (_, i) => `<circle cx="${Math.cos(i * 0.785) * 14}" cy="${Math.sin(i * 0.785) * 14}" r="1.4" fill="#fff"/>`).join('')}
      </g>`;
  }

  function orchid(c) {
    const pet = (rot, w, h) => `<path transform="rotate(${rot})" d="M0 -4 C ${w} -14, ${w} -${h - 8}, 0 -${h} C -${w} -${h - 8}, -${w} -14, 0 -4 Z" ${L} style="fill:${c};fill-opacity:.35"/>`;
    return `<path d="M30 40 C 80 70, 120 70, 170 38" ${L}/>
      <path d="M100 66 C 100 80, 100 90, 100 95" ${L}/>
      ${leaf(160, 220, 64, -160, 'rgba(255,255,255,.06)')}${leaf(40, 225, 64, -22, 'rgba(255,255,255,.06)')}
      <g transform="translate(100 135)">
        ${pet(0, 16, 50)}${pet(72, 19, 54)}${pet(-72, 19, 54)}${pet(144, 15, 46)}${pet(-144, 15, 46)}
        <path d="M-12 6 C -14 34, 14 34, 12 6 Z" ${L} style="fill:${c};fill-opacity:.7"/>
      </g>`;
  }

  function tree(c, r) {
    let canopy = '';
    for (let i = 0; i < 6; i++) canopy += `<circle cx="${60 + r() * 80}" cy="${70 + r() * 55}" r="${26 + r() * 16}" ${L} style="fill:${c};fill-opacity:.12"/>`;
    let dots = '';
    for (let i = 0; i < 12; i++) dots += `<circle cx="${50 + r() * 100}" cy="${50 + r() * 90}" r="2" fill="#fff" fill-opacity=".8"/>`;
    return `<path d="M100 240 L100 140 M100 175 L74 148 M100 165 L128 138" ${L}/>
      <path d="M70 240 H130" ${L}/>${canopy}${dots}`;
  }

  function palm(c, r) {
    let fronds = '';
    for (let i = 0; i < 9; i++) fronds += leaf(100, 74, 74 + r() * 16, -170 + i * 20, `${c}33`);
    return `<path d="M100 245 C 92 190, 110 130, 100 76" ${L}/>
      ${[0, 1, 2, 3, 4, 5].map((i) => `<path d="M${96 - i * 0.6} ${230 - i * 26} h ${9 + i * 0.4}" ${L} stroke-opacity=".5"/>`).join('')}
      ${fronds}<circle cx="95" cy="84" r="6" ${L}/><circle cx="106" cy="86" r="6" ${L}/>`;
  }

  function mangrove(c, r) {
    let roots = '';
    for (let i = 0; i < 7; i++) {
      const x = 42 + i * 19 + r() * 4;
      roots += `<path d="M100 150 C ${x} 168, ${x} 196, ${x} 224" ${L}/>`;
    }
    const water = [0, 1, 2].map((i) => `<path d="M${20 + i * 12} ${228 + i * 8} q 10 -4 20 0 t 20 0 t 20 0 t 20 0 t 20 0 t 20 0 t 20 0" ${L} stroke-opacity=".45"/>`).join('');
    return `${roots}<path d="M100 150 V 108" ${L}/>
      <path d="M38 96 C 30 60, 80 40, 100 52 C 120 36, 174 52, 164 92 C 176 120, 120 128, 100 116 C 80 130, 26 124, 38 96 Z" ${L} style="fill:${c};fill-opacity:.25"/>
      ${water}`;
  }

  function vine(c, r) {
    let leaves = '';
    for (let i = 0; i < 7; i++) {
      const t = i / 6, x = 30 + t * 140, y = 205 - Math.sin(t * Math.PI) * 120;
      leaves += leaf(x, y, 30, (i % 2 ? -60 : 120) + r() * 20, 'rgba(255,255,255,.06)');
    }
    const bloom = (x, y) => `<g transform="translate(${x} ${y})">
      <circle r="16" ${L} style="fill:${c};fill-opacity:.35"/>
      ${[0, 72, 144, 216, 288].map((a) => `<path transform="rotate(${a})" d="M0 0 L0 -15" ${L} stroke-opacity=".6"/>`).join('')}
      <circle r="3.5" fill="#fff"/></g>`;
    return `<path d="M30 205 Q 100 -35, 170 205" ${L}/>${leaves}${bloom(68, 116)}${bloom(132, 104)}${bloom(100, 74)}`;
  }

  const drawers = { Flower: flower, Orchid: orchid, Tree: tree, Palm: palm, Mangrove: mangrove, 'Shrub & Vine': vine,
    Vegetable: vine, Herb: palm, Ornamental: flower };

  /** Returns an SVG string for a species (or any object with id, color, category). */
  function svg(sp, opts = {}) {
    const c = sp.color && /^#[0-9a-f]{6}$/i.test(sp.color) ? sp.color : '#5b8a4a';
    const r = rng(hash(sp.id || 'x') + (opts.variant || 0) * 97);
    const top = mix(c, BASE, 0.62), bottom = mix(c, BASE, 0.86);
    const uid = 'g' + hash((sp.id || 'x') + (opts.variant || 0)).toString(36);
    const draw = drawers[sp.category] || flower;
    const grid = opts.plain ? '' : `<g stroke="#fff" stroke-opacity=".05">${[40, 80, 120, 160].map((v) => `<path d="M${v} 0V250"/>`).join('')}${[50, 100, 150, 200].map((v) => `<path d="M0 ${v}H200"/>`).join('')}</g>`;
    return `<svg class="art" viewBox="0 0 200 250" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Illustration of ${sp.local_name || 'plant'}">
      <defs>
        <linearGradient id="${uid}l" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${top}"/><stop offset="1" stop-color="${bottom}"/></linearGradient>
        <radialGradient id="${uid}r" cx=".5" cy=".42" r=".55"><stop offset="0" stop-color="${c}" stop-opacity=".45"/><stop offset="1" stop-color="${c}" stop-opacity="0"/></radialGradient>
      </defs>
      <rect width="200" height="250" fill="url(#${uid}l)"/><rect width="200" height="250" fill="url(#${uid}r)"/>
      ${grid}${draw(c, r)}</svg>`;
  }

  return { svg };
})();

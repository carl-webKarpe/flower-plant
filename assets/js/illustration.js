/**
 * Botanical placeholder art.
 * Until the team uploads real field photos, every species gets a generated
 * "herbarium plate" drawn in its own colour, so the layout never shows a broken image.
 */
window.LunhawArt = (function () {
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
  const LEAF = '#2f5a35';
  const INK = '#13261b';

  const leaf = (x, y, len, rot, fill) =>
    `<path transform="translate(${x} ${y}) rotate(${rot})" d="M0 0 C ${len * 0.35} ${-len * 0.28}, ${len * 0.75} ${-len * 0.22}, ${len} 0 C ${len * 0.75} ${len * 0.22}, ${len * 0.35} ${len * 0.28}, 0 0 Z" fill="${fill}"/>`;

  function flower(c, r) {
    const n = 5 + Math.floor(r() * 3);
    let petals = '';
    for (let i = 0; i < n; i++) {
      const a = (360 / n) * i + r() * 8;
      petals += `<ellipse cx="0" cy="-30" rx="17" ry="32" fill="${i % 2 ? c : mix(c, '#ffffff', 0.12)}" transform="rotate(${a})"/>`;
    }
    return `
      <path d="M100 250 C 98 200, 104 170, 100 120" stroke="${LEAF}" stroke-width="4" fill="none"/>
      ${leaf(100, 200, 62, -35, LEAF)}${leaf(100, 178, 52, -150, mix(LEAF, '#ffffff', 0.15))}
      <g transform="translate(100 100)">${petals}
        <circle r="14" fill="${mix(c, '#f6d36b', 0.6)}"/><circle r="6" fill="${mix(c, INK, 0.4)}"/>
      </g>`;
  }

  function orchid(c) {
    const pet = (rot, rx, ry, f) => `<ellipse cx="0" cy="-34" rx="${rx}" ry="${ry}" fill="${f}" transform="rotate(${rot})"/>`;
    return `
      <path d="M40 30 C 80 60, 120 60, 160 30" stroke="${mix(LEAF, '#8a6a3a', 0.5)}" stroke-width="7" fill="none" stroke-linecap="round"/>
      ${leaf(150, 210, 60, -165, LEAF)}${leaf(50, 220, 60, -20, LEAF)}
      <g transform="translate(100 120)">
        ${pet(0, 18, 34, c)}${pet(72, 20, 36, mix(c, '#ffffff', 0.15))}${pet(-72, 20, 36, mix(c, '#ffffff', 0.15))}
        ${pet(144, 18, 34, c)}${pet(-144, 18, 34, c)}
        <path d="M-14 6 C -14 40, 14 40, 14 6 Z" fill="${mix(c, INK, 0.35)}"/>
        <circle r="8" fill="#f8f1e2"/>
      </g>`;
  }

  function tree(c, r) {
    let blobs = '';
    for (let i = 0; i < 7; i++) {
      const x = 55 + r() * 90, y = 60 + r() * 70, rad = 26 + r() * 22;
      blobs += `<circle cx="${x}" cy="${y}" r="${rad}" fill="${i % 2 ? LEAF : mix(LEAF, '#ffffff', 0.12)}"/>`;
    }
    let dots = '';
    for (let i = 0; i < 14; i++) dots += `<circle cx="${50 + r() * 100}" cy="${50 + r() * 90}" r="${3 + r() * 4}" fill="${c}"/>`;
    return `<path d="M94 250 L96 140 L104 140 L106 250 Z" fill="${mix(LEAF, '#6b4a2b', 0.7)}"/>
      <path d="M100 170 L70 140 M100 160 L132 132" stroke="${mix(LEAF, '#6b4a2b', 0.7)}" stroke-width="5"/>
      ${blobs}${dots}`;
  }

  function palm(c, r) {
    let fronds = '';
    for (let i = 0; i < 9; i++) {
      const a = -170 + i * 20 + r() * 6;
      fronds += leaf(100, 70, 78 + r() * 18, a, i % 2 ? c : mix(c, INK, 0.25));
    }
    return `<path d="M100 250 C 92 190, 112 130, 100 72" stroke="${mix(c, '#7a5a35', 0.6)}" stroke-width="9" fill="none" stroke-linecap="round"/>
      ${fronds}<circle cx="96" cy="80" r="7" fill="#6b4a2b"/><circle cx="106" cy="82" r="7" fill="#7a5a35"/>`;
  }

  function mangrove(c, r) {
    let roots = '';
    for (let i = 0; i < 7; i++) {
      const x = 40 + i * 20 + r() * 6;
      roots += `<path d="M100 150 C ${x} 170, ${x} 200, ${x + (r() - 0.5) * 10} 232" stroke="#6b4a2b" stroke-width="4" fill="none"/>`;
    }
    return `<rect x="0" y="210" width="200" height="40" fill="${mix(c, '#7fb0b8', 0.6)}" opacity=".55"/>
      ${roots}<path d="M98 150 L100 100 L102 150 Z" fill="#6b4a2b"/>
      <ellipse cx="100" cy="88" rx="70" ry="44" fill="${c}"/>
      <ellipse cx="70" cy="80" rx="34" ry="26" fill="${mix(c, '#ffffff', 0.15)}"/>
      <ellipse cx="130" cy="76" rx="32" ry="24" fill="${mix(c, INK, 0.2)}"/>`;
  }

  function vine(c, r) {
    let leaves = '';
    for (let i = 0; i < 8; i++) {
      const t = i / 7, x = 30 + t * 140, y = 200 - Math.sin(t * Math.PI) * 120;
      leaves += leaf(x, y, 34, (i % 2 ? -60 : 120) + r() * 20, i % 2 ? LEAF : mix(LEAF, '#ffffff', 0.15));
    }
    const bloom = (x, y) => `<g transform="translate(${x} ${y})"><circle r="16" fill="${c}"/><circle r="9" fill="${mix(c, '#ffffff', 0.35)}"/><circle r="4" fill="${mix(c, INK, 0.4)}"/></g>`;
    return `<path d="M30 200 Q 100 -40, 170 200" stroke="${LEAF}" stroke-width="3" fill="none"/>${leaves}
      ${bloom(70, 112)}${bloom(128, 100)}${bloom(100, 72)}`;
  }

  const drawers = { Flower: flower, Orchid: orchid, Tree: tree, Palm: palm, Mangrove: mangrove, 'Shrub & Vine': vine };

  /** Returns an SVG string for a species (or any {id, color, category}). */
  function svg(sp, opts = {}) {
    const c = sp.color && /^#[0-9a-f]{6}$/i.test(sp.color) ? sp.color : '#5b8a4a';
    // very light colours (white flowers) need a darker backdrop to read
    const light = parseInt(c.slice(1, 3), 16) + parseInt(c.slice(3, 5), 16) + parseInt(c.slice(5, 7), 16) > 600;
    const bg = opts.bg || (light ? mix('#2b4a33', c, 0.15) : mix(c, '#f3efe4', 0.82));
    const r = rng(hash(sp.id || 'x') + (opts.variant || 0) * 97);
    const draw = drawers[sp.category] || flower;
    const grid = opts.plain ? '' :
      `<g stroke="${light ? '#ffffff' : INK}" stroke-opacity=".07">${[50, 100, 150].map((v) => `<path d="M${v} 0V250M0 ${v}H200"/>`).join('')}</g>`;
    return `<svg class="art" viewBox="0 0 200 250" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Illustration of ${sp.local_name || ''}">
      <rect width="200" height="250" fill="${bg}"/>${grid}${draw(c, r)}</svg>`;
  }

  return { svg };
})();

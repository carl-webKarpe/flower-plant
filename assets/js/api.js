/**
 * Data access layer. Every page reads data ONLY through these functions,
 * so switching from sample data to the PHP REST API is a one-line change in config.js.
 *
 * Expected API responses (JSON):
 *   GET {API_BASE}/species.php                 → { "data": [ species, ... ] }
 *   GET {API_BASE}/species.php?id=gumamela     → { "data": species }
 *   GET {API_BASE}/categories.php              → { "data": [ { name, blurb }, ... ] }
 *   GET {API_BASE}/municipalities.php          → { "data": [ "Dapa", ... ] }
 *   GET {API_BASE}/videos.php                  → { "data": [ { src, title, description, poster, species|null }, ... ] }
 * A bare array/object (without the "data" wrapper) is also accepted.
 */
window.SiargaoFloraAPI = (function () {
  const cfg = window.LUNHAW_CONFIG || {};
  const mock = window.LUNHAW_DATA;
  let source = cfg.USE_API ? 'api' : 'sample';

  async function request(path, params) {
    const url = new URL(`${cfg.API_BASE.replace(/\/$/, '')}/${path}`, window.location.href);
    Object.entries(params || {}).forEach(([k, v]) => { if (v) url.searchParams.set(k, v); });
    const res = await fetch(url, { headers: { Accept: 'application/json' } });
    if (!res.ok) throw new Error(`API ${res.status} on ${url.pathname}`);
    const json = await res.json();
    return json && Object.prototype.hasOwnProperty.call(json, 'data') ? json.data : json;
  }

  async function withFallback(apiCall, mockValue) {
    if (!cfg.USE_API) return clone(mockValue);
    try {
      const data = await apiCall();
      source = 'api';
      return data;
    } catch (err) {
      console.warn('[Siargao Flora] API unavailable, using sample data.', err);
      source = 'sample';
      return clone(mockValue);
    }
  }

  const clone = (v) => (v === undefined ? v : JSON.parse(JSON.stringify(v)));

  return {
    source: () => source,

    getSpecies(filters = {}) {
      return withFallback(
        () => request('species.php', filters),
        mock.species
      );
    },

    getSpeciesById(id) {
      return withFallback(
        () => request('species.php', { id }),
        mock.species.find((s) => s.id === id) || null
      );
    },

    /** Every video: general field footage first, then each species' clips (with a short species summary). */
    getVideos() {
      const summary = (sp) => ({ id: sp.id, local_name: sp.local_name, scientific_name: sp.scientific_name, category: sp.category, color: sp.color });
      const mockVideos = [
        ...(mock.videos || []).map((v) => ({ ...v, species: null })),
        ...mock.species.flatMap((sp) => (sp.videos || []).map((v) => ({ ...v, species: summary(sp) }))),
      ];
      return withFallback(() => request('videos.php'), mockVideos);
    },

    getCategories() {
      return withFallback(() => request('categories.php'), mock.categories);
    },

    getMunicipalities() {
      return withFallback(() => request('municipalities.php'), mock.municipalities);
    },
  };
})();

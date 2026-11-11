/**
 * Lunhaw front-end configuration.
 *
 * USE_API = false → the site uses the sample records in data.js.
 * USE_API = true  → the site fetches JSON from the PHP REST API at API_BASE.
 *                   If a request fails it falls back to the sample data (and logs a warning).
 */
window.LUNHAW_CONFIG = {
  USE_API: false,
  API_BASE: 'api',          // e.g. 'api' → api/species.php, or 'http://localhost/flower-plant/api'
  SPECIES_IMAGE_DIR: 'assets/images/species/',
  VIDEO_DIR: 'assets/videos/',
};

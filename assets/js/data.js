/**
 * FALLBACK DATA — used only when the REST API cannot be reached.
 * Real records live in the MySQL database and are managed on manage.php.
 *
 * Shape of one species (the API should return the same fields):
 * {
 *   id, local_name, common_name, scientific_name, family, category,
 *   color (hex, used for the illustrated placeholder), native (bool), status,
 *   municipalities: [], habitat, blooming, uses, description,
 *   photos: [{ src, caption }], videos: [{ src, title, poster }], date_added
 * }
 * Photo/video `src` values are file names relative to assets/images/species/ and assets/videos/
 * (or full URLs). Missing files automatically show an illustrated placeholder.
 */
window.LUNHAW_DATA = {
  municipalities: [
    'Burgos', 'Dapa', 'Del Carmen', 'General Luna', 'Pilar',
    'San Benito', 'San Isidro', 'Santa Monica', 'Socorro',
  ],

  categories: [
    { name: 'Flower',   blurb: 'Ornamental and wild blooms' },
    { name: 'Orchid',   blurb: 'Epiphytes of the forest' },
    { name: 'Tree',     blurb: 'Coastal and inland trees' },
    { name: 'Palm',     blurb: 'Coconut, nipa and kin' },
    { name: 'Mangrove', blurb: 'Tidal forest guardians' },
    { name: 'Shrub & Vine', blurb: 'Beach creepers and shrubs' },
  ],

  // Field footage not tied to a single species (shown on the home page and in Gallery → Videos)
  videos: [
    {
      src: 'garden-tour.mp4', poster: 'garden-tour.jpg', title: 'Garden tour',
      description: 'Aglaonema, Dendrobium orchid, Dieffenbachia and sugarcane',
    },
  ],

  // Species come from the database through the API. Add them on the Manage data page (manage.php).
  // This list is only used as a fallback when the API cannot be reached.
  species: [],
};

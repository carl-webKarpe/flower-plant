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
    { name: "Vegetable", blurb: "Food plants from farms and home gardens" },
    { name: "Herb", blurb: "Aromatic plants for cooking and tea" },
    { name: "Ornamental", blurb: "Flowers and foliage for gardens and homes" },
  ],

  // Field footage not tied to a single species (shown on the home page and in Gallery → Videos)
  videos: [
    {
      src: 'garden-tour.mp4', poster: 'garden-tour.jpg', title: 'Garden tour',
      description: 'Aglaonema, Dendrobium orchid, Dieffenbachia and sugarcane',
    },
    {
      src: 'ornamental-garden.mp4', poster: 'ornamental-garden.jpg', title: 'Ornamental garden',
      description: 'Bromeliads, anthurium, fan palm and hanging plants',
    },
    {
      src: 'plant-nursery.mp4', poster: 'plant-nursery.jpg', title: 'Plant nursery',
      description: 'Potted bougainvillea and young plants in nursery bags',
    },
  ],

  // Field data (PlantsInfo.docx). Real records live in the database; this copy is only used
  // when the API cannot be reached.
  species: [
    {
      "id": "kamatis",
      "local_name": "Kamatis",
      "common_name": "Tomato",
      "scientific_name": "Solanum lycopersicum",
      "family": "Solanaceae",
      "category": "Vegetable",
      "color": "#d8342b",
      "native": false,
      "origin": "South America",
      "status": null,
      "municipalities": [
        "Dapa"
      ],
      "habitat": "Gardens, farms, and places with sunlight.",
      "blooming": null,
      "uses": "Used in cooking, salads, sauces, and other foods.",
      "description": "A tomato (kamatis) is a small, round fruit that is usually red when ripe. It has a juicy texture, soft inside, and a slightly sweet and sour taste. It is commonly used in salads, sauces, and different Filipino dishes.",
      "photos": [
        {
          "src": "kamatis-1.jpg",
          "caption": "Seedlings — Farm Land, Dapa, Siargao"
        }
      ],
      "videos": [],
      "date_added": "2026-11-14"
    },
    {
      "id": "talong",
      "local_name": "Talong",
      "common_name": "Eggplant",
      "scientific_name": "Solanum melongena",
      "family": "Solanaceae",
      "category": "Vegetable",
      "color": "#6b3fa0",
      "native": true,
      "origin": "Southeast Asia",
      "status": null,
      "municipalities": [
        "Dapa"
      ],
      "habitat": "Gardens and farms with warm weather and well-drained soil.",
      "blooming": null,
      "uses": "Commonly cooked as food, especially in Filipino dishes.",
      "description": "Eggplant (talong) is a purple, elongated vegetable with soft flesh and small seeds inside. It has a mild taste and is commonly used in Filipino dishes like tortang talong and pinakbet.",
      "photos": [
        {
          "src": "talong-1.jpg",
          "caption": "Seedlings — Farm Land, Dapa, Siargao"
        }
      ],
      "videos": [],
      "date_added": "2026-11-14"
    },
    {
      "id": "tangkong",
      "local_name": "Tangkong",
      "common_name": "Water Spinach",
      "scientific_name": "Ipomoea aquatica",
      "family": "Convolvulaceae",
      "category": "Vegetable",
      "color": "#4f8a3c",
      "native": true,
      "origin": "Tropical and subtropical Asia",
      "status": null,
      "municipalities": [
        "Pilar"
      ],
      "habitat": "Wet soil, ponds, riversides, and canals.",
      "blooming": null,
      "uses": "Its young leaves and stems are cooked as vegetables.",
      "description": "Water spinach (tangkong) is a green leafy vegetable with long, hollow stems and soft leaves. It has a mild taste and is commonly used in Filipino dishes like adobong kangkong.",
      "photos": [
        {
          "src": "tangkong-1.jpg",
          "caption": "San Roque, Pilar, Surigao del Norte"
        }
      ],
      "videos": [],
      "date_added": "2026-11-14"
    },
    {
      "id": "pako",
      "local_name": "Pako",
      "common_name": "Bird's Nest Fern",
      "scientific_name": "Asplenium nidus",
      "family": "Aspleniaceae",
      "category": "Ornamental",
      "color": "#3f7a3a",
      "native": true,
      "origin": "Tropical Asia",
      "status": null,
      "municipalities": [
        "General Luna"
      ],
      "habitat": "Shady forests, tree trunks, and moist gardens.",
      "blooming": null,
      "uses": "Used as an ornamental plant for gardens and home decoration.",
      "description": "Bird's Nest Fern (pako) is a green leafy plant with long, wide leaves that grow in a circular shape. It usually grows in shady and moist places and is commonly found on trees or rocks.",
      "photos": [
        {
          "src": "pako-1.jpg",
          "caption": "General Luna, Siargao"
        }
      ],
      "videos": [],
      "date_added": "2026-11-14"
    },
    {
      "id": "tanglad",
      "local_name": "Tanglad",
      "common_name": "Lemongrass",
      "scientific_name": "Cymbopogon citratus",
      "family": "Poaceae",
      "category": "Herb",
      "color": "#8fb06a",
      "native": true,
      "origin": "Southeast Asia",
      "status": null,
      "municipalities": [
        "Pilar"
      ],
      "habitat": "Grows in tropical climates with plenty of sunlight and well-drained soil.",
      "blooming": null,
      "uses": "Used as a cooking ingredient, herbal tea, and natural fragrance.",
      "description": "Lemongrass (tanglad) is a grass-like plant with long, narrow green leaves. It has a fresh lemon-like smell and is commonly used in Filipino cooking.",
      "photos": [
        {
          "src": "tanglad-1.jpg",
          "caption": "Home gardens and farms in Pilar, Surigao del Norte"
        }
      ],
      "videos": [],
      "date_added": "2026-11-14"
    },
    {
      "id": "sili",
      "local_name": "Sili",
      "common_name": "Chili Pepper",
      "scientific_name": "Capsicum frutescens",
      "family": "Solanaceae",
      "category": "Vegetable",
      "color": "#d43a1f",
      "native": false,
      "origin": "Tropical America",
      "status": null,
      "municipalities": [
        "General Luna"
      ],
      "habitat": "Grows in warm climates with sunlight and fertile, well-drained soil.",
      "blooming": null,
      "uses": "Used as a spice in cooking and for adding a spicy flavor to food.",
      "description": "Chili pepper (sili) is a small plant with green leaves and small fruits that turn red when mature. Its fruits have a hot and spicy taste.",
      "photos": [
        {
          "src": "sili-1.jpg",
          "caption": "Home gardens and farms in General Luna, Surigao del Norte"
        }
      ],
      "videos": [],
      "date_added": "2026-11-14"
    },
    {
      "id": "sawa-sawa",
      "local_name": "Sawa-Sawa",
      "common_name": "Snake Plant",
      "scientific_name": "Dracaena trifasciata",
      "family": "Asparagaceae",
      "category": "Ornamental",
      "color": "#5f8a3a",
      "native": false,
      "origin": "Tropical West Africa",
      "status": null,
      "municipalities": [
        "General Luna"
      ],
      "habitat": "Grows in warm environments and can survive in dry soil with little water.",
      "blooming": null,
      "uses": "Used as an ornamental plant and for decoration.",
      "description": "Snake plant (sawa-sawa) has long, upright, sword-shaped leaves with green and yellow patterns. It is easy to maintain and does not need frequent watering.",
      "photos": [
        {
          "src": "sawa-sawa-1.jpg",
          "caption": "Home gardens and indoor/outdoor spaces in General Luna, Surigao del Norte"
        }
      ],
      "videos": [],
      "date_added": "2026-11-14"
    },
    {
      "id": "bugambilya",
      "local_name": "Bugambilya",
      "common_name": "Paper Flower (Bougainvillea)",
      "scientific_name": "Bougainvillea glabra",
      "family": "Nyctaginaceae",
      "category": "Ornamental",
      "color": "#ef6a3a",
      "native": false,
      "origin": "South America",
      "status": null,
      "municipalities": [
        "General Luna"
      ],
      "habitat": "Grows in sunny places with well-drained soil.",
      "blooming": null,
      "uses": "Used for garden decoration, landscaping, and beautifying surroundings.",
      "description": "Paper flower (bugambilya) is a climbing or bushy plant with colorful, paper-like leaves called bracts. Its colors include pink, purple, red, orange, and white.",
      "photos": [
        {
          "src": "bugambilya-1.jpg",
          "caption": "Gardens, yards, and roadsides in Libertad, General Luna, Surigao del Norte"
        }
      ],
      "videos": [],
      "date_added": "2026-11-14"
    },
    {
      "id": "gumamela",
      "local_name": "Gumamela",
      "common_name": "Double-Flowered Chinese Hibiscus",
      "scientific_name": "Hibiscus rosa-sinensis",
      "family": "Malvaceae",
      "category": "Ornamental",
      "color": "#e8708e",
      "native": true,
      "origin": "Tropical Asia (exact native range uncertain)",
      "status": null,
      "municipalities": [
        "General Luna"
      ],
      "habitat": "Grows in tropical climates with sunlight, regular watering, and fertile soil.",
      "blooming": null,
      "uses": "Used as an ornamental plant for garden decoration and landscaping.",
      "description": "Double-flowered Chinese hibiscus (gumamela) is a flowering shrub with large, colorful flowers containing several layers of petals. It commonly produces red, pink, orange, or yellow flowers.",
      "photos": [
        {
          "src": "gumamela-1.jpg",
          "caption": "Home gardens and landscaped areas in Libertad, General Luna, Surigao del Norte"
        }
      ],
      "videos": [],
      "date_added": "2026-11-14"
    },
    {
      "id": "orkid",
      "local_name": "Orkid",
      "common_name": "Orchids",
      "scientific_name": "Orchidaceae",
      "family": "Orchidaceae",
      "category": "Ornamental",
      "color": "#d9c6e8",
      "native": true,
      "origin": "Found naturally in many parts of the world, especially tropical regions",
      "status": null,
      "municipalities": [
        "Dapa"
      ],
      "habitat": "Commonly grows in tropical environments. Some orchids grow on tree branches, while others grow in soil.",
      "blooming": null,
      "uses": "Used for decoration, landscaping, flower arrangements, and collection.",
      "description": "Orchids are flowering plants known for their beautiful and unique flowers. They come in different colors, shapes, and sizes. Some grow attached to trees while others grow in pots or soil. (Exact species not yet identified.)",
      "photos": [
        {
          "src": "orkid-1.jpg",
          "caption": "Dapa, Surigao del Norte"
        }
      ],
      "videos": [],
      "date_added": "2026-11-14"
    }
  ],
};

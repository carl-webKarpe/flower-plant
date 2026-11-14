-- Siargao Flora database (System Integration and Architecture final project)
-- Run in MySQL Workbench: creates the database, tables and all collected records.
SET NAMES utf8mb4;
DROP DATABASE IF EXISTS siargao_flora;
CREATE DATABASE siargao_flora CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE siargao_flora;

CREATE TABLE categories (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(50) NOT NULL UNIQUE,
  blurb VARCHAR(150)
);

CREATE TABLE municipalities (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(80) NOT NULL UNIQUE
);

CREATE TABLE species (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  slug VARCHAR(80) NOT NULL UNIQUE,
  local_name VARCHAR(100) NOT NULL,
  common_name VARCHAR(120),
  scientific_name VARCHAR(150) NOT NULL,
  family VARCHAR(100),
  category_id INT UNSIGNED NOT NULL,
  color CHAR(7) DEFAULT '#5b8a4a',
  is_native TINYINT(1) NOT NULL DEFAULT 0,
  origin VARCHAR(255),
  status VARCHAR(50),
  habitat VARCHAR(255),
  blooming VARCHAR(150),
  uses TEXT,
  description TEXT,
  date_added DATE NOT NULL DEFAULT (CURRENT_DATE),
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (category_id) REFERENCES categories (id)
);

CREATE TABLE species_municipalities (
  species_id INT UNSIGNED NOT NULL,
  municipality_id INT UNSIGNED NOT NULL,
  PRIMARY KEY (species_id, municipality_id),
  FOREIGN KEY (species_id) REFERENCES species (id) ON DELETE CASCADE,
  FOREIGN KEY (municipality_id) REFERENCES municipalities (id) ON DELETE CASCADE
);

CREATE TABLE species_photos (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  species_id INT UNSIGNED NOT NULL,
  src VARCHAR(255) NOT NULL,
  caption VARCHAR(255),
  sort_order INT NOT NULL DEFAULT 0,
  FOREIGN KEY (species_id) REFERENCES species (id) ON DELETE CASCADE
);

CREATE TABLE species_videos (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  species_id INT UNSIGNED NULL,  -- NULL = general field footage
  src VARCHAR(255) NOT NULL,
  title VARCHAR(255),
  description VARCHAR(255),
  poster VARCHAR(255),
  sort_order INT NOT NULL DEFAULT 0,
  FOREIGN KEY (species_id) REFERENCES species (id) ON DELETE CASCADE
);

INSERT INTO categories VALUES
(1, 'Vegetable', 'Food plants from farms and home gardens'),
(2, 'Herb', 'Aromatic plants for cooking and tea'),
(3, 'Ornamental', 'Flowers and foliage for gardens and homes'),
(4, 'Fruit', 'Fruit trees and fruit-bearing plants'),
(5, 'Palm', 'Coconut and other palms');

INSERT INTO municipalities VALUES
(1, 'Burgos'),
(2, 'Dapa'),
(3, 'Del Carmen'),
(4, 'General Luna'),
(5, 'Pilar'),
(6, 'San Benito'),
(7, 'San Isidro'),
(8, 'Santa Monica'),
(9, 'Socorro');

-- category_id: 1 Vegetable, 2 Herb, 3 Ornamental, 4 Fruit, 5 Palm
INSERT INTO species (id, slug, local_name, common_name, scientific_name, family, category_id, color, is_native, origin, status, habitat, blooming, uses, description, date_added) VALUES
(1, 'kamatis', 'Kamatis', 'Tomato', 'Solanum lycopersicum', 'Solanaceae', 1, '#d8342b', 0, 'South America', NULL, 'Gardens, farms, and places with sunlight.', NULL, 'Used in cooking, salads, sauces, and other foods.', 'A tomato (kamatis) is a small, round fruit that is usually red when ripe. It has a juicy texture, soft inside, and a slightly sweet and sour taste. It is commonly used in salads, sauces, and different Filipino dishes.', '2026-11-14'),
(2, 'talong', 'Talong', 'Eggplant', 'Solanum melongena', 'Solanaceae', 1, '#6b3fa0', 1, 'Southeast Asia', NULL, 'Gardens and farms with warm weather and well-drained soil.', NULL, 'Commonly cooked as food, especially in Filipino dishes.', 'Eggplant (talong) is a purple, elongated vegetable with soft flesh and small seeds inside. It has a mild taste and is commonly used in Filipino dishes like tortang talong and pinakbet.', '2026-11-14'),
(3, 'tangkong', 'Tangkong', 'Water Spinach', 'Ipomoea aquatica', 'Convolvulaceae', 1, '#4f8a3c', 1, 'Tropical and subtropical Asia', NULL, 'Wet soil, ponds, riversides, and canals.', NULL, 'Its young leaves and stems are cooked as vegetables.', 'Water spinach (tangkong) is a green leafy vegetable with long, hollow stems and soft leaves. It has a mild taste and is commonly used in Filipino dishes like adobong kangkong.', '2026-11-14'),
(4, 'pako', 'Pako', 'Bird''s Nest Fern', 'Asplenium nidus', 'Aspleniaceae', 3, '#3f7a3a', 1, 'Tropical Asia', NULL, 'Shady forests, tree trunks, and moist gardens.', NULL, 'Used as an ornamental plant for gardens and home decoration.', 'Bird''s Nest Fern (pako) is a green leafy plant with long, wide leaves that grow in a circular shape. It usually grows in shady and moist places and is commonly found on trees or rocks.', '2026-11-14'),
(5, 'tanglad', 'Tanglad', 'Lemongrass', 'Cymbopogon citratus', 'Poaceae', 2, '#8fb06a', 1, 'Southeast Asia', NULL, 'Grows in tropical climates with plenty of sunlight and well-drained soil.', NULL, 'Used as a cooking ingredient, herbal tea, and natural fragrance.', 'Lemongrass (tanglad) is a grass-like plant with long, narrow green leaves. It has a fresh lemon-like smell and is commonly used in Filipino cooking.', '2026-11-14'),
(6, 'sili', 'Sili', 'Chili Pepper', 'Capsicum frutescens', 'Solanaceae', 1, '#d43a1f', 0, 'Tropical America', NULL, 'Grows in warm climates with sunlight and fertile, well-drained soil.', NULL, 'Used as a spice in cooking and for adding a spicy flavor to food.', 'Chili pepper (sili) is a small plant with green leaves and small fruits that turn red when mature. Its fruits have a hot and spicy taste.', '2026-11-14'),
(7, 'sawa-sawa', 'Sawa-Sawa', 'Snake Plant', 'Dracaena trifasciata', 'Asparagaceae', 3, '#5f8a3a', 0, 'Tropical West Africa', NULL, 'Grows in warm environments and can survive in dry soil with little water.', NULL, 'Used as an ornamental plant and for decoration.', 'Snake plant (sawa-sawa) has long, upright, sword-shaped leaves with green and yellow patterns. It is easy to maintain and does not need frequent watering.', '2026-11-14'),
(8, 'bugambilya', 'Bugambilya', 'Paper Flower (Bougainvillea)', 'Bougainvillea glabra', 'Nyctaginaceae', 3, '#ef6a3a', 0, 'South America', NULL, 'Grows in sunny places with well-drained soil.', NULL, 'Used for garden decoration, landscaping, and beautifying surroundings.', 'Paper flower (bugambilya) is a climbing or bushy plant with colorful, paper-like leaves called bracts. Its colors include pink, purple, red, orange, and white.', '2026-11-14'),
(9, 'gumamela', 'Gumamela', 'Double-Flowered Chinese Hibiscus', 'Hibiscus rosa-sinensis', 'Malvaceae', 3, '#e8708e', 1, 'Tropical Asia (exact native range uncertain)', NULL, 'Grows in tropical climates with sunlight, regular watering, and fertile soil.', NULL, 'Used as an ornamental plant for garden decoration and landscaping.', 'Double-flowered Chinese hibiscus (gumamela) is a flowering shrub with large, colorful flowers containing several layers of petals. It commonly produces red, pink, orange, or yellow flowers.', '2026-11-14'),
(10, 'orkid', 'Orkid', 'Orchids', 'Orchidaceae', 'Orchidaceae', 3, '#d9c6e8', 1, 'Found naturally in many parts of the world, especially tropical regions', NULL, 'Commonly grows in tropical environments. Some orchids grow on tree branches, while others grow in soil.', NULL, 'Used for decoration, landscaping, flower arrangements, and collection.', 'Orchids are flowering plants known for their beautiful and unique flowers. They come in different colors, shapes, and sizes. Some grow attached to trees while others grow in pots or soil. (Exact species not yet identified.)', '2026-11-14'),
(11, 'maguey', 'Maguey', 'Mauritius Hemp', 'Furcraea foetida', 'Asparagaceae', 3, '#6f9a3a', 0, 'Caribbean and northern South America', NULL, 'Tropical and subtropical areas, especially sunny and dry places.', NULL, 'Garden decoration and fiber production.', 'Mauritius Hemp (maguey) is a plant with long, thick, and pointed green leaves. It can grow in hot and dry places. Its leaves can be used to produce natural fibers. (Possible identification — not yet confirmed.)', '2026-11-14'),
(12, 'sahod-yaman', 'Sahod-Yaman', 'Tree Philodendron', 'Thaumatophyllum bipinnatifidum', 'Araceae', 3, '#4f8a3c', 0, 'South America', NULL, 'Tropical forests with moist soil and partial shade.', NULL, 'Garden decoration and landscaping.', 'Tree philodendron (sahod-yaman) has large green leaves with deep cuts along the edges. It grows well in warm places and makes gardens look beautiful.', '2026-11-14'),
(13, 'baging-baging', 'Baging-baging', 'String of Nickels', 'Dischidia nummularia', 'Apocynaceae', 3, '#9cc46a', 1, 'Southeast Asia and Australia', NULL, 'Tropical forests, usually growing on tree branches.', NULL, 'Hanging decoration and landscaping.', 'String of nickels (baging-baging) has small, round, and light green leaves. Its long stems hang down, making it beautiful for hanging pots. (The local name may vary by place.)', '2026-11-14'),
(14, 'umbrella-plant', 'Umbrella Plant', 'Variegated Dwarf Umbrella Plant', 'Heptapleurum arboricola', 'Araliaceae', 3, '#c9c97a', 1, 'Taiwan and Hainan, China', NULL, 'Tropical and subtropical forests.', NULL, 'Garden decoration, landscaping, and indoor decoration.', 'The variegated dwarf umbrella plant (formerly Schefflera arboricola) has green and creamy white leaves. Its leaves grow in groups and look like a small umbrella. It is commonly planted to make gardens and homes beautiful.', '2026-11-14'),
(15, 'bromeliad', 'Bromeliad', 'Blushing Bromeliad', 'Neoregelia carolinae', 'Bromeliaceae', 3, '#c2506e', 0, 'South America, especially Brazil', NULL, 'Tropical forests and warm, humid environments.', NULL, 'Garden decoration, landscaping, and indoor decoration.', 'Blushing bromeliad is a colorful plant with green leaves and a red or pink center. Its leaves grow in a circular shape. It is commonly used to make gardens and homes beautiful. (Possible identification — not yet confirmed.)', '2026-11-14'),
(16, 'kapayas', 'Kapayas', 'Papaya', 'Carica papaya', 'Caricaceae', 4, '#f0962e', 0, 'Central America and southern Mexico', NULL, 'Tropical and warm places.', NULL, 'Its fruit is eaten fresh and used in cooking.', 'Papaya (kapayas) is a small tree with a straight trunk, large green leaves, and oval fruits. Its fruit is green when unripe and yellow or orange when ripe.', '2026-11-14'),
(17, 'bayabas', 'Bayabas', 'Guava', 'Psidium guajava', 'Myrtaceae', 4, '#8fb34a', 0, 'Tropical America', NULL, 'Tropical and subtropical areas.', NULL, 'Its fruit is eaten, and its leaves are traditionally used for herbal preparations.', 'Guava (bayabas) is a small tree with green leaves and round fruits. Its fruits can be green or yellow when ripe.', '2026-11-14'),
(18, 'dragon-fruit', 'Dragon Fruit', 'Dragon Fruit (Pitaya)', 'Selenicereus undatus', 'Cactaceae', 4, '#d6336c', 0, 'Central America', NULL, 'Warm tropical and subtropical areas.', NULL, 'Its fruit is eaten fresh and used in juices and desserts.', 'Dragon fruit is a climbing cactus with long green stems. It produces colorful fruits with white or red flesh.', '2026-11-14'),
(19, 'niyog', 'Niyog', 'Coconut', 'Cocos nucifera', 'Arecaceae', 5, '#7f9a3e', 1, 'Indo-Pacific region', NULL, 'Tropical areas, especially coastal places.', NULL, 'Used for coconut water, milk, oil, food, and building materials.', 'Coconut (niyog) is a tall palm tree with a long trunk, large leaves, and round fruits.', '2026-11-14'),
(20, 'kawayan', 'Kawayan', 'Bamboo', 'Bambusa vulgaris', 'Poaceae', 3, '#6a9a3a', 1, 'Tropical Asia', NULL, 'Tropical and subtropical areas with moist soil and enough sunlight.', NULL, 'Used for building houses, making furniture, fences, baskets, and other handicrafts. It is also used for garden decoration.', 'Bamboo (kawayan) is a fast-growing plant with tall, green, and hollow stems. It has long, narrow leaves and grows in groups. It is strong and useful for many things, such as building materials and furniture.', '2026-11-14');

-- municipality_id: 1 Burgos, 2 Dapa, 3 Del Carmen, 4 General Luna, 5 Pilar, 6 San Benito, 7 San Isidro, 8 Santa Monica, 9 Socorro
INSERT INTO species_municipalities VALUES (1, 2), (2, 2), (3, 5), (4, 4), (5, 5), (6, 4), (7, 4), (8, 4), (9, 4), (10, 2), (11, 3), (12, 5), (13, 7), (14, 4), (15, 4), (16, 5), (17, 3), (18, 3), (19, 4), (20, 5);

INSERT INTO species_photos (species_id, src, caption) VALUES
(1, 'kamatis-1.jpg', 'Seedlings — Farm Land, Dapa, Siargao'),
(2, 'talong-1.jpg', 'Seedlings — Farm Land, Dapa, Siargao'),
(3, 'tangkong-1.jpg', 'San Roque, Pilar, Surigao del Norte'),
(4, 'pako-1.jpg', 'General Luna, Siargao'),
(5, 'tanglad-1.jpg', 'Home gardens and farms in Pilar, Surigao del Norte'),
(6, 'sili-1.jpg', 'Home gardens and farms in General Luna, Surigao del Norte'),
(7, 'sawa-sawa-1.jpg', 'Home gardens and indoor/outdoor spaces in General Luna, Surigao del Norte'),
(8, 'bugambilya-1.jpg', 'Gardens, yards, and roadsides in Libertad, General Luna, Surigao del Norte'),
(9, 'gumamela-1.jpg', 'Home gardens and landscaped areas in Libertad, General Luna, Surigao del Norte'),
(10, 'orkid-1.jpg', 'Dapa, Surigao del Norte'),
(11, 'maguey-1.jpg', 'Del Carmen, Surigao del Norte'),
(12, 'sahod-yaman-1.jpg', 'Pilar, Surigao del Norte'),
(13, 'baging-baging-1.jpg', 'San Isidro, Surigao del Norte'),
(14, 'umbrella-plant-1.jpg', 'General Luna, Surigao del Norte'),
(15, 'bromeliad-1.jpg', 'General Luna, Surigao del Norte'),
(16, 'kapayas-1.jpg', 'Pilar, Surigao del Norte'),
(17, 'bayabas-1.jpg', 'Del Carmen, Surigao del Norte'),
(18, 'dragon-fruit-1.jpg', 'Del Carmen, Surigao del Norte'),
(19, 'niyog-1.jpg', 'General Luna, Surigao del Norte'),
(20, 'kawayan-1.jpg', 'Pilar, Surigao del Norte');

INSERT INTO species_videos (species_id, src, title, description, poster, sort_order) VALUES
(NULL, 'garden-tour.mp4', 'Garden tour', 'Aglaonema, Dendrobium orchid, Dieffenbachia and sugarcane', 'garden-tour.jpg', 0),
(NULL, 'ornamental-garden.mp4', 'Ornamental garden', 'Bromeliads, anthurium, fan palm and hanging plants', 'ornamental-garden.jpg', 1),
(NULL, 'plant-nursery.mp4', 'Plant nursery', 'Potted bougainvillea and young plants in nursery bags', 'plant-nursery.jpg', 2);

-- View: one readable row per plant (try: SELECT * FROM species_overview;)
CREATE VIEW species_overview AS
SELECT s.id, s.local_name, s.common_name, s.scientific_name, s.family, c.name AS plant_group,
       IF(s.is_native, 'Native', 'Introduced') AS native_or_introduced, s.origin,
       GROUP_CONCAT(m.name ORDER BY m.name SEPARATOR ', ') AS recorded_in
FROM species s
JOIN categories c ON c.id = s.category_id
LEFT JOIN species_municipalities sm ON sm.species_id = s.id
LEFT JOIN municipalities m ON m.id = sm.municipality_id
GROUP BY s.id, s.local_name, s.common_name, s.scientific_name, s.family, c.name, s.is_native, s.origin;

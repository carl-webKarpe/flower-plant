-- =====================================================================
--  SIARGAO FLORA — MySQL database
--  System Integration and Architecture · Final Project
--
--  Database : siargao_flora
--  Purpose  : documents the flowers and plants found on Siargao Island,
--             Surigao del Norte (names, classification, origin, habitat,
--             uses, where they were recorded, photos and field videos).
--
--  Contents : 6 tables, 5 foreign-key relationships, 1 view,
--             and all records collected during data gathering:
--             20 species · 5 plant groups · 9 municipalities ·
--             20 photos · 3 field videos
--
--  How to use: open this file in MySQL Workbench and click Execute (⚡).
--  WARNING: it drops and recreates the `siargao_flora` database.
-- =====================================================================

SET NAMES utf8mb4;

DROP DATABASE IF EXISTS siargao_flora;
CREATE DATABASE siargao_flora CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE siargao_flora;

-- ---------------------------------------------------------------------
--  STRUCTURE
-- ---------------------------------------------------------------------

-- Plant groups used to classify species (Vegetable, Herb, Ornamental, Fruit, Palm)
CREATE TABLE categories (
  id     INT UNSIGNED  NOT NULL AUTO_INCREMENT  COMMENT 'Primary key',
  name   VARCHAR(50)   NOT NULL                 COMMENT 'Group name, e.g. Ornamental',
  blurb  VARCHAR(150)  NULL                     COMMENT 'Short description of the group',
  PRIMARY KEY (id),
  UNIQUE KEY uq_categories_name (name)
) ENGINE=InnoDB COMMENT='Plant groups';

-- The nine municipalities of the Siargao island group
CREATE TABLE municipalities (
  id    INT UNSIGNED  NOT NULL AUTO_INCREMENT  COMMENT 'Primary key',
  name  VARCHAR(80)   NOT NULL                 COMMENT 'Municipality name, e.g. General Luna',
  PRIMARY KEY (id),
  UNIQUE KEY uq_municipalities_name (name)
) ENGINE=InnoDB COMMENT='Municipalities of Siargao';

-- One row per plant / flower recorded in the field
CREATE TABLE species (
  id               INT UNSIGNED  NOT NULL AUTO_INCREMENT  COMMENT 'Primary key',
  slug             VARCHAR(80)   NOT NULL                 COMMENT 'URL identifier, e.g. gumamela (species.php?id=gumamela)',
  local_name       VARCHAR(100)  NOT NULL                 COMMENT 'Local (Bisaya/Filipino) name',
  common_name      VARCHAR(120)  NULL                     COMMENT 'English common name',
  scientific_name  VARCHAR(150)  NOT NULL                 COMMENT 'Scientific (Latin) name',
  family           VARCHAR(100)  NULL                     COMMENT 'Botanical family',
  category_id      INT UNSIGNED  NOT NULL                 COMMENT 'FK → categories.id (plant group)',
  color            CHAR(7)       NULL DEFAULT '#5b8a4a'   COMMENT 'Hex colour used for the website illustration',
  is_native        TINYINT(1)    NOT NULL DEFAULT 0       COMMENT '1 = native to Asia, 0 = introduced',
  origin           VARCHAR(255)  NULL                     COMMENT 'Where the plant originally comes from',
  status           VARCHAR(50)   NULL                     COMMENT 'Optional status, e.g. Endangered',
  habitat          VARCHAR(255)  NULL                     COMMENT 'Where it grows',
  blooming         VARCHAR(150)  NULL                     COMMENT 'Blooming / fruiting season',
  uses             TEXT          NULL                     COMMENT 'Uses and significance',
  description      TEXT          NULL                     COMMENT 'Description of the plant',
  date_added       DATE          NOT NULL DEFAULT (CURRENT_DATE) COMMENT 'Date the record was added',
  created_at       TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Row created',
  updated_at       TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Row last changed',
  PRIMARY KEY (id),
  UNIQUE KEY uq_species_slug (slug),
  KEY idx_species_category (category_id),
  KEY idx_species_local_name (local_name),
  CONSTRAINT fk_species_category FOREIGN KEY (category_id) REFERENCES categories (id)
    ON UPDATE CASCADE ON DELETE RESTRICT
) ENGINE=InnoDB COMMENT='Plants and flowers recorded on Siargao Island';

-- Where each species was recorded (many-to-many: species ↔ municipalities)
CREATE TABLE species_municipalities (
  species_id       INT UNSIGNED  NOT NULL  COMMENT 'PK + FK → species.id',
  municipality_id  INT UNSIGNED  NOT NULL  COMMENT 'PK + FK → municipalities.id',
  PRIMARY KEY (species_id, municipality_id),
  KEY idx_sm_municipality (municipality_id),
  CONSTRAINT fk_sm_species FOREIGN KEY (species_id) REFERENCES species (id)
    ON UPDATE CASCADE ON DELETE CASCADE,
  CONSTRAINT fk_sm_muni FOREIGN KEY (municipality_id) REFERENCES municipalities (id)
    ON UPDATE CASCADE ON DELETE CASCADE
) ENGINE=InnoDB COMMENT='Link table: municipalities where each species was recorded';

-- Photos of each species (one species → many photos)
CREATE TABLE species_photos (
  id          INT UNSIGNED  NOT NULL AUTO_INCREMENT  COMMENT 'Primary key',
  species_id  INT UNSIGNED  NOT NULL                 COMMENT 'FK → species.id',
  src         VARCHAR(255)  NOT NULL                 COMMENT 'File name in assets/images/species/ or a full URL',
  caption     VARCHAR(255)  NULL                     COMMENT 'Caption, usually where the photo was taken',
  sort_order  INT           NOT NULL DEFAULT 0       COMMENT 'Display order (0 = main photo)',
  PRIMARY KEY (id),
  KEY idx_photos_species (species_id),
  CONSTRAINT fk_photo_species FOREIGN KEY (species_id) REFERENCES species (id)
    ON UPDATE CASCADE ON DELETE CASCADE
) ENGINE=InnoDB COMMENT='Species photos';

-- Field videos (one species → many videos; species_id is NULL for general footage)
CREATE TABLE species_videos (
  id           INT UNSIGNED  NOT NULL AUTO_INCREMENT  COMMENT 'Primary key',
  species_id   INT UNSIGNED  NULL                     COMMENT 'FK → species.id (NULL = general field footage)',
  src          VARCHAR(255)  NOT NULL                 COMMENT 'File name in assets/videos/, a full URL or a YouTube link',
  title        VARCHAR(255)  NULL                     COMMENT 'Video title',
  description  VARCHAR(255)  NULL                     COMMENT 'What the video shows',
  poster       VARCHAR(255)  NULL                     COMMENT 'Cover image file name in assets/videos/',
  sort_order   INT           NOT NULL DEFAULT 0       COMMENT 'Display order',
  PRIMARY KEY (id),
  KEY idx_videos_species (species_id),
  CONSTRAINT fk_video_species FOREIGN KEY (species_id) REFERENCES species (id)
    ON UPDATE CASCADE ON DELETE CASCADE
) ENGINE=InnoDB COMMENT='Field videos';

-- ---------------------------------------------------------
--  RECORDS: municipalities, plant groups and the data gathered in the field
-- ---------------------------------------------------------
INSERT INTO municipalities (name) VALUES
  ('Burgos'),
  ('Dapa'),
  ('Del Carmen'),
  ('General Luna'),
  ('Pilar'),
  ('San Benito'),
  ('San Isidro'),
  ('Santa Monica'),
  ('Socorro');

INSERT INTO categories (name, blurb) VALUES
  ('Vegetable', 'Food plants from farms and home gardens'),
  ('Herb', 'Aromatic plants for cooking and tea'),
  ('Ornamental', 'Flowers and foliage for gardens and homes');

-- Field data: 10 plants gathered in Dapa, Pilar and General Luna (from PlantsInfo.docx)
INSERT INTO species (slug, local_name, common_name, scientific_name, family, category_id, color, is_native, origin, status, habitat, blooming, uses, description, date_added) VALUES
  ('kamatis', 'Kamatis', 'Tomato', 'Solanum lycopersicum', 'Solanaceae', (SELECT id FROM categories WHERE name = 'Vegetable'), '#d8342b', 0, 'South America', NULL, 'Gardens, farms, and places with sunlight.', NULL, 'Used in cooking, salads, sauces, and other foods.', 'A tomato (kamatis) is a small, round fruit that is usually red when ripe. It has a juicy texture, soft inside, and a slightly sweet and sour taste. It is commonly used in salads, sauces, and different Filipino dishes.', '2026-11-14'),
  ('talong', 'Talong', 'Eggplant', 'Solanum melongena', 'Solanaceae', (SELECT id FROM categories WHERE name = 'Vegetable'), '#6b3fa0', 1, 'Southeast Asia', NULL, 'Gardens and farms with warm weather and well-drained soil.', NULL, 'Commonly cooked as food, especially in Filipino dishes.', 'Eggplant (talong) is a purple, elongated vegetable with soft flesh and small seeds inside. It has a mild taste and is commonly used in Filipino dishes like tortang talong and pinakbet.', '2026-11-14'),
  ('tangkong', 'Tangkong', 'Water Spinach', 'Ipomoea aquatica', 'Convolvulaceae', (SELECT id FROM categories WHERE name = 'Vegetable'), '#4f8a3c', 1, 'Tropical and subtropical Asia', NULL, 'Wet soil, ponds, riversides, and canals.', NULL, 'Its young leaves and stems are cooked as vegetables.', 'Water spinach (tangkong) is a green leafy vegetable with long, hollow stems and soft leaves. It has a mild taste and is commonly used in Filipino dishes like adobong kangkong.', '2026-11-14'),
  ('pako', 'Pako', 'Bird''s Nest Fern', 'Asplenium nidus', 'Aspleniaceae', (SELECT id FROM categories WHERE name = 'Ornamental'), '#3f7a3a', 1, 'Tropical Asia', NULL, 'Shady forests, tree trunks, and moist gardens.', NULL, 'Used as an ornamental plant for gardens and home decoration.', 'Bird''s Nest Fern (pako) is a green leafy plant with long, wide leaves that grow in a circular shape. It usually grows in shady and moist places and is commonly found on trees or rocks.', '2026-11-14'),
  ('tanglad', 'Tanglad', 'Lemongrass', 'Cymbopogon citratus', 'Poaceae', (SELECT id FROM categories WHERE name = 'Herb'), '#8fb06a', 1, 'Southeast Asia', NULL, 'Grows in tropical climates with plenty of sunlight and well-drained soil.', NULL, 'Used as a cooking ingredient, herbal tea, and natural fragrance.', 'Lemongrass (tanglad) is a grass-like plant with long, narrow green leaves. It has a fresh lemon-like smell and is commonly used in Filipino cooking.', '2026-11-14'),
  ('sili', 'Sili', 'Chili Pepper', 'Capsicum frutescens', 'Solanaceae', (SELECT id FROM categories WHERE name = 'Vegetable'), '#d43a1f', 0, 'Tropical America', NULL, 'Grows in warm climates with sunlight and fertile, well-drained soil.', NULL, 'Used as a spice in cooking and for adding a spicy flavor to food.', 'Chili pepper (sili) is a small plant with green leaves and small fruits that turn red when mature. Its fruits have a hot and spicy taste.', '2026-11-14'),
  ('sawa-sawa', 'Sawa-Sawa', 'Snake Plant', 'Dracaena trifasciata', 'Asparagaceae', (SELECT id FROM categories WHERE name = 'Ornamental'), '#5f8a3a', 0, 'Tropical West Africa', NULL, 'Grows in warm environments and can survive in dry soil with little water.', NULL, 'Used as an ornamental plant and for decoration.', 'Snake plant (sawa-sawa) has long, upright, sword-shaped leaves with green and yellow patterns. It is easy to maintain and does not need frequent watering.', '2026-11-14'),
  ('bugambilya', 'Bugambilya', 'Paper Flower (Bougainvillea)', 'Bougainvillea glabra', 'Nyctaginaceae', (SELECT id FROM categories WHERE name = 'Ornamental'), '#ef6a3a', 0, 'South America', NULL, 'Grows in sunny places with well-drained soil.', NULL, 'Used for garden decoration, landscaping, and beautifying surroundings.', 'Paper flower (bugambilya) is a climbing or bushy plant with colorful, paper-like leaves called bracts. Its colors include pink, purple, red, orange, and white.', '2026-11-14'),
  ('gumamela', 'Gumamela', 'Double-Flowered Chinese Hibiscus', 'Hibiscus rosa-sinensis', 'Malvaceae', (SELECT id FROM categories WHERE name = 'Ornamental'), '#e8708e', 1, 'Tropical Asia (exact native range uncertain)', NULL, 'Grows in tropical climates with sunlight, regular watering, and fertile soil.', NULL, 'Used as an ornamental plant for garden decoration and landscaping.', 'Double-flowered Chinese hibiscus (gumamela) is a flowering shrub with large, colorful flowers containing several layers of petals. It commonly produces red, pink, orange, or yellow flowers.', '2026-11-14'),
  ('orkid', 'Orkid', 'Orchids', 'Orchidaceae', 'Orchidaceae', (SELECT id FROM categories WHERE name = 'Ornamental'), '#d9c6e8', 1, 'Found naturally in many parts of the world, especially tropical regions', NULL, 'Commonly grows in tropical environments. Some orchids grow on tree branches, while others grow in soil.', NULL, 'Used for decoration, landscaping, flower arrangements, and collection.', 'Orchids are flowering plants known for their beautiful and unique flowers. They come in different colors, shapes, and sizes. Some grow attached to trees while others grow in pots or soil. (Exact species not yet identified.)', '2026-11-14');

INSERT INTO species_municipalities (species_id, municipality_id) VALUES
  ((SELECT id FROM species WHERE slug = 'kamatis'), (SELECT id FROM municipalities WHERE name = 'Dapa')),
  ((SELECT id FROM species WHERE slug = 'talong'), (SELECT id FROM municipalities WHERE name = 'Dapa')),
  ((SELECT id FROM species WHERE slug = 'tangkong'), (SELECT id FROM municipalities WHERE name = 'Pilar')),
  ((SELECT id FROM species WHERE slug = 'pako'), (SELECT id FROM municipalities WHERE name = 'General Luna')),
  ((SELECT id FROM species WHERE slug = 'tanglad'), (SELECT id FROM municipalities WHERE name = 'Pilar')),
  ((SELECT id FROM species WHERE slug = 'sili'), (SELECT id FROM municipalities WHERE name = 'General Luna')),
  ((SELECT id FROM species WHERE slug = 'sawa-sawa'), (SELECT id FROM municipalities WHERE name = 'General Luna')),
  ((SELECT id FROM species WHERE slug = 'bugambilya'), (SELECT id FROM municipalities WHERE name = 'General Luna')),
  ((SELECT id FROM species WHERE slug = 'gumamela'), (SELECT id FROM municipalities WHERE name = 'General Luna')),
  ((SELECT id FROM species WHERE slug = 'orkid'), (SELECT id FROM municipalities WHERE name = 'Dapa'));

INSERT INTO species_photos (species_id, src, caption, sort_order) VALUES
  ((SELECT id FROM species WHERE slug = 'kamatis'), 'kamatis-1.jpg', 'Seedlings — Farm Land, Dapa, Siargao', 0),
  ((SELECT id FROM species WHERE slug = 'talong'), 'talong-1.jpg', 'Seedlings — Farm Land, Dapa, Siargao', 0),
  ((SELECT id FROM species WHERE slug = 'tangkong'), 'tangkong-1.jpg', 'San Roque, Pilar, Surigao del Norte', 0),
  ((SELECT id FROM species WHERE slug = 'pako'), 'pako-1.jpg', 'General Luna, Siargao', 0),
  ((SELECT id FROM species WHERE slug = 'tanglad'), 'tanglad-1.jpg', 'Home gardens and farms in Pilar, Surigao del Norte', 0),
  ((SELECT id FROM species WHERE slug = 'sili'), 'sili-1.jpg', 'Home gardens and farms in General Luna, Surigao del Norte', 0),
  ((SELECT id FROM species WHERE slug = 'sawa-sawa'), 'sawa-sawa-1.jpg', 'Home gardens and indoor/outdoor spaces in General Luna, Surigao del Norte', 0),
  ((SELECT id FROM species WHERE slug = 'bugambilya'), 'bugambilya-1.jpg', 'Gardens, yards, and roadsides in Libertad, General Luna, Surigao del Norte', 0),
  ((SELECT id FROM species WHERE slug = 'gumamela'), 'gumamela-1.jpg', 'Home gardens and landscaped areas in Libertad, General Luna, Surigao del Norte', 0),
  ((SELECT id FROM species WHERE slug = 'orkid'), 'orkid-1.jpg', 'Dapa, Surigao del Norte', 0);

INSERT INTO categories (name, blurb) VALUES
  ('Fruit', 'Fruit trees and fruit-bearing plants'),
  ('Palm', 'Coconut and other palms');

-- Field data, batch 2: 10 plants from Del Carmen, Pilar, San Isidro and General Luna (docs/PlantsInfo-2.docx)
INSERT INTO species (slug, local_name, common_name, scientific_name, family, category_id, color, is_native, origin, status, habitat, blooming, uses, description, date_added) VALUES
  ('maguey', 'Maguey', 'Mauritius Hemp', 'Furcraea foetida', 'Asparagaceae', (SELECT id FROM categories WHERE name = 'Ornamental'), '#6f9a3a', 0, 'Caribbean and northern South America', NULL, 'Tropical and subtropical areas, especially sunny and dry places.', NULL, 'Garden decoration and fiber production.', 'Mauritius Hemp (maguey) is a plant with long, thick, and pointed green leaves. It can grow in hot and dry places. Its leaves can be used to produce natural fibers. (Possible identification — not yet confirmed.)', '2026-11-14'),
  ('sahod-yaman', 'Sahod-Yaman', 'Tree Philodendron', 'Thaumatophyllum bipinnatifidum', 'Araceae', (SELECT id FROM categories WHERE name = 'Ornamental'), '#4f8a3c', 0, 'South America', NULL, 'Tropical forests with moist soil and partial shade.', NULL, 'Garden decoration and landscaping.', 'Tree philodendron (sahod-yaman) has large green leaves with deep cuts along the edges. It grows well in warm places and makes gardens look beautiful.', '2026-11-14'),
  ('baging-baging', 'Baging-baging', 'String of Nickels', 'Dischidia nummularia', 'Apocynaceae', (SELECT id FROM categories WHERE name = 'Ornamental'), '#9cc46a', 1, 'Southeast Asia and Australia', NULL, 'Tropical forests, usually growing on tree branches.', NULL, 'Hanging decoration and landscaping.', 'String of nickels (baging-baging) has small, round, and light green leaves. Its long stems hang down, making it beautiful for hanging pots. (The local name may vary by place.)', '2026-11-14'),
  ('umbrella-plant', 'Umbrella Plant', 'Variegated Dwarf Umbrella Plant', 'Heptapleurum arboricola', 'Araliaceae', (SELECT id FROM categories WHERE name = 'Ornamental'), '#c9c97a', 1, 'Taiwan and Hainan, China', NULL, 'Tropical and subtropical forests.', NULL, 'Garden decoration, landscaping, and indoor decoration.', 'The variegated dwarf umbrella plant (formerly Schefflera arboricola) has green and creamy white leaves. Its leaves grow in groups and look like a small umbrella. It is commonly planted to make gardens and homes beautiful.', '2026-11-14'),
  ('bromeliad', 'Bromeliad', 'Blushing Bromeliad', 'Neoregelia carolinae', 'Bromeliaceae', (SELECT id FROM categories WHERE name = 'Ornamental'), '#c2506e', 0, 'South America, especially Brazil', NULL, 'Tropical forests and warm, humid environments.', NULL, 'Garden decoration, landscaping, and indoor decoration.', 'Blushing bromeliad is a colorful plant with green leaves and a red or pink center. Its leaves grow in a circular shape. It is commonly used to make gardens and homes beautiful. (Possible identification — not yet confirmed.)', '2026-11-14'),
  ('kapayas', 'Kapayas', 'Papaya', 'Carica papaya', 'Caricaceae', (SELECT id FROM categories WHERE name = 'Fruit'), '#f0962e', 0, 'Central America and southern Mexico', NULL, 'Tropical and warm places.', NULL, 'Its fruit is eaten fresh and used in cooking.', 'Papaya (kapayas) is a small tree with a straight trunk, large green leaves, and oval fruits. Its fruit is green when unripe and yellow or orange when ripe.', '2026-11-14'),
  ('bayabas', 'Bayabas', 'Guava', 'Psidium guajava', 'Myrtaceae', (SELECT id FROM categories WHERE name = 'Fruit'), '#8fb34a', 0, 'Tropical America', NULL, 'Tropical and subtropical areas.', NULL, 'Its fruit is eaten, and its leaves are traditionally used for herbal preparations.', 'Guava (bayabas) is a small tree with green leaves and round fruits. Its fruits can be green or yellow when ripe.', '2026-11-14'),
  ('dragon-fruit', 'Dragon Fruit', 'Dragon Fruit (Pitaya)', 'Selenicereus undatus', 'Cactaceae', (SELECT id FROM categories WHERE name = 'Fruit'), '#d6336c', 0, 'Central America', NULL, 'Warm tropical and subtropical areas.', NULL, 'Its fruit is eaten fresh and used in juices and desserts.', 'Dragon fruit is a climbing cactus with long green stems. It produces colorful fruits with white or red flesh.', '2026-11-14'),
  ('niyog', 'Niyog', 'Coconut', 'Cocos nucifera', 'Arecaceae', (SELECT id FROM categories WHERE name = 'Palm'), '#7f9a3e', 1, 'Indo-Pacific region', NULL, 'Tropical areas, especially coastal places.', NULL, 'Used for coconut water, milk, oil, food, and building materials.', 'Coconut (niyog) is a tall palm tree with a long trunk, large leaves, and round fruits.', '2026-11-14'),
  ('kawayan', 'Kawayan', 'Bamboo', 'Bambusa vulgaris', 'Poaceae', (SELECT id FROM categories WHERE name = 'Ornamental'), '#6a9a3a', 1, 'Tropical Asia', NULL, 'Tropical and subtropical areas with moist soil and enough sunlight.', NULL, 'Used for building houses, making furniture, fences, baskets, and other handicrafts. It is also used for garden decoration.', 'Bamboo (kawayan) is a fast-growing plant with tall, green, and hollow stems. It has long, narrow leaves and grows in groups. It is strong and useful for many things, such as building materials and furniture.', '2026-11-14');

INSERT INTO species_municipalities (species_id, municipality_id) VALUES
  ((SELECT id FROM species WHERE slug = 'maguey'), (SELECT id FROM municipalities WHERE name = 'Del Carmen')),
  ((SELECT id FROM species WHERE slug = 'sahod-yaman'), (SELECT id FROM municipalities WHERE name = 'Pilar')),
  ((SELECT id FROM species WHERE slug = 'baging-baging'), (SELECT id FROM municipalities WHERE name = 'San Isidro')),
  ((SELECT id FROM species WHERE slug = 'umbrella-plant'), (SELECT id FROM municipalities WHERE name = 'General Luna')),
  ((SELECT id FROM species WHERE slug = 'bromeliad'), (SELECT id FROM municipalities WHERE name = 'General Luna')),
  ((SELECT id FROM species WHERE slug = 'kapayas'), (SELECT id FROM municipalities WHERE name = 'Pilar')),
  ((SELECT id FROM species WHERE slug = 'bayabas'), (SELECT id FROM municipalities WHERE name = 'Del Carmen')),
  ((SELECT id FROM species WHERE slug = 'dragon-fruit'), (SELECT id FROM municipalities WHERE name = 'Del Carmen')),
  ((SELECT id FROM species WHERE slug = 'niyog'), (SELECT id FROM municipalities WHERE name = 'General Luna')),
  ((SELECT id FROM species WHERE slug = 'kawayan'), (SELECT id FROM municipalities WHERE name = 'Pilar'));

INSERT INTO species_photos (species_id, src, caption, sort_order) VALUES
  ((SELECT id FROM species WHERE slug = 'maguey'), 'maguey-1.jpg', 'Del Carmen, Surigao del Norte', 0),
  ((SELECT id FROM species WHERE slug = 'sahod-yaman'), 'sahod-yaman-1.jpg', 'Pilar, Surigao del Norte', 0),
  ((SELECT id FROM species WHERE slug = 'baging-baging'), 'baging-baging-1.jpg', 'San Isidro, Surigao del Norte', 0),
  ((SELECT id FROM species WHERE slug = 'umbrella-plant'), 'umbrella-plant-1.jpg', 'General Luna, Surigao del Norte', 0),
  ((SELECT id FROM species WHERE slug = 'bromeliad'), 'bromeliad-1.jpg', 'General Luna, Surigao del Norte', 0),
  ((SELECT id FROM species WHERE slug = 'kapayas'), 'kapayas-1.jpg', 'Pilar, Surigao del Norte', 0),
  ((SELECT id FROM species WHERE slug = 'bayabas'), 'bayabas-1.jpg', 'Del Carmen, Surigao del Norte', 0),
  ((SELECT id FROM species WHERE slug = 'dragon-fruit'), 'dragon-fruit-1.jpg', 'Del Carmen, Surigao del Norte', 0),
  ((SELECT id FROM species WHERE slug = 'niyog'), 'niyog-1.jpg', 'General Luna, Surigao del Norte', 0),
  ((SELECT id FROM species WHERE slug = 'kawayan'), 'kawayan-1.jpg', 'Pilar, Surigao del Norte', 0);

-- General field footage (not tied to one species)
INSERT INTO species_videos (species_id, src, title, description, poster, sort_order) VALUES
  (NULL, 'garden-tour.mp4', 'Garden tour', 'Aglaonema, Dendrobium orchid, Dieffenbachia and sugarcane', 'garden-tour.jpg', 0),
  (NULL, 'ornamental-garden.mp4', 'Ornamental garden', 'Bromeliads, anthurium, fan palm and hanging plants', 'ornamental-garden.jpg', 1),
  (NULL, 'plant-nursery.mp4', 'Plant nursery', 'Potted bougainvillea and young plants in nursery bags', 'plant-nursery.jpg', 2);

-- ---------------------------------------------------------------------
--  VIEW: one readable row per species (group, towns, photo count)
--  Try it in Workbench:  SELECT * FROM species_overview;
-- ---------------------------------------------------------------------
CREATE VIEW species_overview AS
SELECT s.id,
       s.local_name,
       s.common_name,
       s.scientific_name,
       s.family,
       c.name AS plant_group,
       CASE WHEN s.is_native = 1 THEN 'Native' ELSE 'Introduced' END AS native_or_introduced,
       s.origin,
       GROUP_CONCAT(DISTINCT m.name ORDER BY m.name SEPARATOR ', ') AS recorded_in,
       (SELECT COUNT(*) FROM species_photos p WHERE p.species_id = s.id) AS photos
FROM species s
JOIN categories c                  ON c.id = s.category_id
LEFT JOIN species_municipalities sm ON sm.species_id = s.id
LEFT JOIN municipalities m          ON m.id = sm.municipality_id
GROUP BY s.id, s.local_name, s.common_name, s.scientific_name, s.family, c.name, s.is_native, s.origin;

-- ---------------------------------------------------------------------
--  CHECK: record counts (shown in Workbench after running the file)
-- ---------------------------------------------------------------------
SELECT (SELECT COUNT(*) FROM species)                AS species,
       (SELECT COUNT(*) FROM categories)             AS plant_groups,
       (SELECT COUNT(*) FROM municipalities)         AS municipalities,
       (SELECT COUNT(*) FROM species_municipalities) AS species_town_links,
       (SELECT COUNT(*) FROM species_photos)         AS photos,
       (SELECT COUNT(*) FROM species_videos)         AS videos;

-- =========================================================
--  Siargao Flora · database update 03
--  Replaces ALL existing species and plant groups with the 10 plants
--  gathered in the field (PlantsInfo.docx), and adds the `origin` column.
--  Keeps: municipalities and general field footage (garden tour video).
--  Run ONCE in MySQL Workbench (after update-01).
--  If you ever re-run it, remove the ALTER TABLE line first (the column already exists).
-- =========================================================
USE lunhaw;
SET NAMES utf8mb4;

ALTER TABLE species ADD COLUMN origin VARCHAR(255) NULL AFTER is_native;

SET SQL_SAFE_UPDATES = 0;
DELETE FROM species;            -- also removes their towns, photos and videos (ON DELETE CASCADE)
DELETE FROM categories;         -- old demo groups (Flower, Tree, Palm, ...)
ALTER TABLE species AUTO_INCREMENT = 1;
ALTER TABLE categories AUTO_INCREMENT = 1;
SET SQL_SAFE_UPDATES = 1;

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

-- Check: should show 10 species, 3 categories, 9 municipalities, 10 photos
SELECT (SELECT COUNT(*) FROM species)        AS species,
       (SELECT COUNT(*) FROM categories)     AS categories,
       (SELECT COUNT(*) FROM municipalities) AS municipalities,
       (SELECT COUNT(*) FROM species_photos) AS photos;

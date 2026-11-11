-- =========================================================
--  Siargao Flora · MySQL database
--  Run this whole script in MySQL Workbench (lightning-bolt "Execute" button).
--  It creates the `lunhaw` database, all tables, and sample records.
--  WARNING: re-running it drops and recreates the database.
-- =========================================================

SET NAMES utf8mb4;

DROP DATABASE IF EXISTS lunhaw;
CREATE DATABASE lunhaw CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE lunhaw;

-- Plant groups (Flower, Tree, Mangrove, ...)
CREATE TABLE categories (
  id     INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name   VARCHAR(50)  NOT NULL UNIQUE,
  blurb  VARCHAR(150) NULL
) ENGINE=InnoDB;

-- The nine municipalities of Siargao
CREATE TABLE municipalities (
  id    INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name  VARCHAR(80) NOT NULL UNIQUE
) ENGINE=InnoDB;

-- One row per flower / plant
CREATE TABLE species (
  id               INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  slug             VARCHAR(80)  NOT NULL UNIQUE,         -- used in URLs: species.php?id=gumamela
  local_name       VARCHAR(100) NOT NULL,
  common_name      VARCHAR(120) NULL,
  scientific_name  VARCHAR(150) NOT NULL,
  family           VARCHAR(100) NULL,
  category_id      INT UNSIGNED NOT NULL,
  color            CHAR(7)      NULL DEFAULT '#5b8a4a',  -- hex colour for the placeholder art
  is_native        TINYINT(1)   NOT NULL DEFAULT 0,
  status           VARCHAR(50)  NULL,                    -- e.g. Native, Cultivated, Endangered
  habitat          VARCHAR(255) NULL,
  blooming         VARCHAR(150) NULL,
  uses             TEXT         NULL,
  description      TEXT         NULL,
  date_added       DATE         NOT NULL DEFAULT (CURRENT_DATE),
  created_at       TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at       TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_species_category FOREIGN KEY (category_id) REFERENCES categories(id)
) ENGINE=InnoDB;

-- Where each species was recorded (many-to-many)
CREATE TABLE species_municipalities (
  species_id       INT UNSIGNED NOT NULL,
  municipality_id  INT UNSIGNED NOT NULL,
  PRIMARY KEY (species_id, municipality_id),
  CONSTRAINT fk_sm_species FOREIGN KEY (species_id) REFERENCES species(id) ON DELETE CASCADE,
  CONSTRAINT fk_sm_muni    FOREIGN KEY (municipality_id) REFERENCES municipalities(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- Photos: `src` is a file name in assets/images/species/ or a full URL
CREATE TABLE species_photos (
  id          INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  species_id  INT UNSIGNED NOT NULL,
  src         VARCHAR(255) NOT NULL,
  caption     VARCHAR(255) NULL,
  sort_order  INT NOT NULL DEFAULT 0,
  CONSTRAINT fk_photo_species FOREIGN KEY (species_id) REFERENCES species(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- Videos: `src` is a file name in assets/videos/, a full URL, or a YouTube link
CREATE TABLE species_videos (
  id          INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  species_id  INT UNSIGNED NOT NULL,
  src         VARCHAR(255) NOT NULL,
  title       VARCHAR(255) NULL,
  sort_order  INT NOT NULL DEFAULT 0,
  CONSTRAINT fk_video_species FOREIGN KEY (species_id) REFERENCES species(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ---------------------------------------------------------
--  Sample records (replace with your gathered field data)
-- ---------------------------------------------------------
INSERT INTO categories (name, blurb) VALUES
  ('Flower', 'Ornamental and wild blooms'),
  ('Orchid', 'Epiphytes of the forest'),
  ('Tree', 'Coastal and inland trees'),
  ('Palm', 'Coconut, nipa and kin'),
  ('Mangrove', 'Tidal forest guardians'),
  ('Shrub & Vine', 'Beach creepers and shrubs');

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

INSERT INTO species (slug, local_name, common_name, scientific_name, family, category_id, color, is_native, status, habitat, blooming, uses, description, date_added) VALUES
  ('gumamela', 'Gumamela', 'Chinese hibiscus', 'Hibiscus rosa-sinensis', 'Malvaceae', (SELECT id FROM categories WHERE name = 'Flower'), '#d8342b', 0, 'Cultivated', 'Home gardens, roadsides and resort fences', 'All year', 'Ornamental hedge; flowers and leaves are used in traditional remedies and as a natural shampoo.', 'The most familiar flower on the island — large, five-petaled blooms with a long central column. Gumamela hedges line many of the roads between General Luna and Dapa.', '2026-10-02'),
  ('bakhaw', 'Bakhaw', 'Tall-stilt mangrove', 'Rhizophora apiculata', 'Rhizophoraceae', (SELECT id FROM categories WHERE name = 'Mangrove'), '#3f6b3a', 1, 'Protected', 'Intertidal mudflats and river mouths', 'Year-round, peaks in the dry season', 'Coastal protection, fish nursery grounds, carbon storage.', 'Recognised by its arching stilt roots, Bakhaw dominates the mangrove forest of Del Carmen — one of the largest contiguous mangrove stands in Mindanao.', '2026-10-05'),
  ('sampaguita', 'Sampaguita', 'Arabian jasmine', 'Jasminum sambac', 'Oleaceae', (SELECT id FROM categories WHERE name = 'Flower'), '#f4efe2', 0, 'Cultivated', 'Home gardens and churchyards', 'Peaks during the rainy months', 'Garlands (leis) for guests and religious offerings; fragrant tea.', 'The national flower of the Philippines. Small, intensely fragrant white flowers that open in the evening.', '2026-10-06'),
  ('kalachuchi', 'Kalachuchi', 'Frangipani', 'Plumeria rubra', 'Apocynaceae', (SELECT id FROM categories WHERE name = 'Flower'), '#f3c74f', 0, 'Cultivated', 'Resort grounds, cemeteries and plazas', 'Dry season (March–June)', 'Ornamental; flowers worn behind the ear and used in decorations.', 'A small tree with thick branches and waxy, sweet-scented flowers — white with a yellow heart — often seen in beachfront resorts.', '2026-10-08'),
  ('ylang-ylang', 'Ilang-ilang', 'Ylang-ylang', 'Cananga odorata', 'Annonaceae', (SELECT id FROM categories WHERE name = 'Tree'), '#c9c23a', 1, 'Native', 'Inland farms and forest edges', 'All year', 'Source of fragrant oil used in perfume; traditional medicine.', 'A fast-growing native tree with drooping, star-shaped yellow-green flowers whose scent carries far at night.', '2026-10-09'),
  ('waling-waling', 'Waling-waling', 'Queen of Philippine orchids', 'Vanda sanderiana', 'Orchidaceae', (SELECT id FROM categories WHERE name = 'Orchid'), '#c4669c', 1, 'Endangered', 'High branches of forest trees (record to be verified)', 'August–November', 'Ornamental; national cultural symbol of Mindanao.', 'A large, flat-faced orchid endemic to Mindanao, patterned in pink and brown. Wild plants are rare and protected — sightings are recorded but locations are kept general.', '2026-10-12'),
  ('nipa', 'Nipa', 'Nipa palm', 'Nypa fruticans', 'Arecaceae', (SELECT id FROM categories WHERE name = 'Palm'), '#5e7d3a', 1, 'Native', 'Brackish rivers behind mangroves', 'All year', 'Leaves for “pawod” roofing; sap for vinegar and tuba.', 'A trunkless palm whose long fronds rise straight from the mud along tidal rivers. Its thatch still roofs many island homes and beach huts.', '2026-10-13'),
  ('lubi', 'Lubi', 'Coconut palm', 'Cocos nucifera', 'Arecaceae', (SELECT id FROM categories WHERE name = 'Palm'), '#7f9a3e', 1, 'Widespread', 'Everywhere — the famous coconut road and plantations', 'All year', 'Food, copra, coco lumber, tuba, weaving — the “tree of life”.', 'The defining plant of Siargao’s landscape. Endless coconut forests frame the road to Pacifico and the palm-lined viewpoint in General Luna.', '2026-10-14'),
  ('talisay', 'Talisay', 'Tropical almond', 'Terminalia catappa', 'Combretaceae', (SELECT id FROM categories WHERE name = 'Tree'), '#b8532e', 1, 'Native', 'Sandy beaches and plazas', 'Twice a year; leaves turn red before falling', 'Shade tree; edible seeds; leaves used for aquarium water.', 'A wide, layered shade tree of the beach. Its leaves turn brilliant red and orange before they drop.', '2026-10-15'),
  ('lambayong', 'Lambayong', 'Beach morning glory', 'Ipomoea pes-caprae', 'Convolvulaceae', (SELECT id FROM categories WHERE name = 'Shrub & Vine'), '#b45bb0', 1, 'Native', 'Upper beach and sand dunes', 'All year', 'Holds sand together and prevents beach erosion; leaves used for jellyfish stings.', 'A creeping vine with goat-hoof shaped leaves and pink-purple trumpet flowers that carpets the sand above the high-tide line.', '2026-10-16'),
  ('pandan-dagat', 'Pandan dagat', 'Screw pine', 'Pandanus tectorius', 'Pandanaceae', (SELECT id FROM categories WHERE name = 'Shrub & Vine'), '#e08a32', 1, 'Native', 'Rocky shores and beach forest', 'Fruits most of the year', 'Leaves woven into mats (banig), hats and baskets.', 'A stilt-rooted coastal shrub with spiral leaves and pineapple-like fruits that ripen to orange.', '2026-10-18'),
  ('banaba', 'Banaba', 'Queen’s crape myrtle', 'Lagerstroemia speciosa', 'Lythraceae', (SELECT id FROM categories WHERE name = 'Tree'), '#9a6fd0', 1, 'Native', 'Roadsides and school grounds', 'April–June', 'Leaves brewed as herbal tea; ornamental shade tree.', 'A native tree that bursts into clusters of crinkled lavender flowers at the start of summer.', '2026-10-20'),
  ('santan', 'Santan', 'Jungle geranium', 'Ixora coccinea', 'Rubiaceae', (SELECT id FROM categories WHERE name = 'Flower'), '#ea5a2f', 0, 'Cultivated', 'Gardens and plaza borders', 'All year', 'Ornamental; children suck the sweet nectar from the flower tubes.', 'Dense clusters of small four-petaled flowers in red, orange or pink — a favourite plant for fences and plazas.', '2026-10-22'),
  ('bitaog', 'Bitaog', 'Beauty leaf', 'Calophyllum inophyllum', 'Calophyllaceae', (SELECT id FROM categories WHERE name = 'Tree'), '#efe7cf', 1, 'Native', 'Beach forest and coastal cliffs', 'Twice a year', 'Seed oil (tamanu) for skin care; timber for boats.', 'A sprawling coastal tree with glossy leaves and small white flowers with yellow centres — a classic of Philippine beach forests.', '2026-10-25'),
  ('bougainvillea', 'Bougainvillea', 'Paper flower', 'Bougainvillea spectabilis', 'Nyctaginaceae', (SELECT id FROM categories WHERE name = 'Flower'), '#d0307e', 0, 'Cultivated', 'Walls, cafés and resort gates', 'Dry season', 'Ornamental climber; fences.', 'Its papery magenta “flowers” are really bracts surrounding tiny white blossoms. Spills over walls along Tourism Road.', '2026-10-28');

INSERT INTO species_municipalities (species_id, municipality_id) VALUES
  ((SELECT id FROM species WHERE slug = 'gumamela'), (SELECT id FROM municipalities WHERE name = 'General Luna')),
  ((SELECT id FROM species WHERE slug = 'gumamela'), (SELECT id FROM municipalities WHERE name = 'Dapa')),
  ((SELECT id FROM species WHERE slug = 'gumamela'), (SELECT id FROM municipalities WHERE name = 'Del Carmen')),
  ((SELECT id FROM species WHERE slug = 'gumamela'), (SELECT id FROM municipalities WHERE name = 'Pilar')),
  ((SELECT id FROM species WHERE slug = 'bakhaw'), (SELECT id FROM municipalities WHERE name = 'Del Carmen')),
  ((SELECT id FROM species WHERE slug = 'bakhaw'), (SELECT id FROM municipalities WHERE name = 'Pilar')),
  ((SELECT id FROM species WHERE slug = 'bakhaw'), (SELECT id FROM municipalities WHERE name = 'San Benito')),
  ((SELECT id FROM species WHERE slug = 'sampaguita'), (SELECT id FROM municipalities WHERE name = 'Dapa')),
  ((SELECT id FROM species WHERE slug = 'sampaguita'), (SELECT id FROM municipalities WHERE name = 'General Luna')),
  ((SELECT id FROM species WHERE slug = 'sampaguita'), (SELECT id FROM municipalities WHERE name = 'Socorro')),
  ((SELECT id FROM species WHERE slug = 'kalachuchi'), (SELECT id FROM municipalities WHERE name = 'General Luna')),
  ((SELECT id FROM species WHERE slug = 'kalachuchi'), (SELECT id FROM municipalities WHERE name = 'Burgos')),
  ((SELECT id FROM species WHERE slug = 'kalachuchi'), (SELECT id FROM municipalities WHERE name = 'Santa Monica')),
  ((SELECT id FROM species WHERE slug = 'ylang-ylang'), (SELECT id FROM municipalities WHERE name = 'San Isidro')),
  ((SELECT id FROM species WHERE slug = 'ylang-ylang'), (SELECT id FROM municipalities WHERE name = 'Pilar')),
  ((SELECT id FROM species WHERE slug = 'ylang-ylang'), (SELECT id FROM municipalities WHERE name = 'Del Carmen')),
  ((SELECT id FROM species WHERE slug = 'waling-waling'), (SELECT id FROM municipalities WHERE name = 'San Isidro')),
  ((SELECT id FROM species WHERE slug = 'nipa'), (SELECT id FROM municipalities WHERE name = 'Del Carmen')),
  ((SELECT id FROM species WHERE slug = 'nipa'), (SELECT id FROM municipalities WHERE name = 'San Benito')),
  ((SELECT id FROM species WHERE slug = 'nipa'), (SELECT id FROM municipalities WHERE name = 'Socorro')),
  ((SELECT id FROM species WHERE slug = 'lubi'), (SELECT id FROM municipalities WHERE name = 'General Luna')),
  ((SELECT id FROM species WHERE slug = 'lubi'), (SELECT id FROM municipalities WHERE name = 'Dapa')),
  ((SELECT id FROM species WHERE slug = 'lubi'), (SELECT id FROM municipalities WHERE name = 'Del Carmen')),
  ((SELECT id FROM species WHERE slug = 'lubi'), (SELECT id FROM municipalities WHERE name = 'Pilar')),
  ((SELECT id FROM species WHERE slug = 'lubi'), (SELECT id FROM municipalities WHERE name = 'San Isidro')),
  ((SELECT id FROM species WHERE slug = 'lubi'), (SELECT id FROM municipalities WHERE name = 'Burgos')),
  ((SELECT id FROM species WHERE slug = 'lubi'), (SELECT id FROM municipalities WHERE name = 'Santa Monica')),
  ((SELECT id FROM species WHERE slug = 'lubi'), (SELECT id FROM municipalities WHERE name = 'San Benito')),
  ((SELECT id FROM species WHERE slug = 'lubi'), (SELECT id FROM municipalities WHERE name = 'Socorro')),
  ((SELECT id FROM species WHERE slug = 'talisay'), (SELECT id FROM municipalities WHERE name = 'General Luna')),
  ((SELECT id FROM species WHERE slug = 'talisay'), (SELECT id FROM municipalities WHERE name = 'Burgos')),
  ((SELECT id FROM species WHERE slug = 'talisay'), (SELECT id FROM municipalities WHERE name = 'Pilar')),
  ((SELECT id FROM species WHERE slug = 'lambayong'), (SELECT id FROM municipalities WHERE name = 'General Luna')),
  ((SELECT id FROM species WHERE slug = 'lambayong'), (SELECT id FROM municipalities WHERE name = 'Santa Monica')),
  ((SELECT id FROM species WHERE slug = 'lambayong'), (SELECT id FROM municipalities WHERE name = 'Burgos')),
  ((SELECT id FROM species WHERE slug = 'pandan-dagat'), (SELECT id FROM municipalities WHERE name = 'Burgos')),
  ((SELECT id FROM species WHERE slug = 'pandan-dagat'), (SELECT id FROM municipalities WHERE name = 'Pilar')),
  ((SELECT id FROM species WHERE slug = 'pandan-dagat'), (SELECT id FROM municipalities WHERE name = 'Socorro')),
  ((SELECT id FROM species WHERE slug = 'banaba'), (SELECT id FROM municipalities WHERE name = 'Dapa')),
  ((SELECT id FROM species WHERE slug = 'banaba'), (SELECT id FROM municipalities WHERE name = 'San Isidro')),
  ((SELECT id FROM species WHERE slug = 'santan'), (SELECT id FROM municipalities WHERE name = 'Dapa')),
  ((SELECT id FROM species WHERE slug = 'santan'), (SELECT id FROM municipalities WHERE name = 'General Luna')),
  ((SELECT id FROM species WHERE slug = 'santan'), (SELECT id FROM municipalities WHERE name = 'Del Carmen')),
  ((SELECT id FROM species WHERE slug = 'santan'), (SELECT id FROM municipalities WHERE name = 'Santa Monica')),
  ((SELECT id FROM species WHERE slug = 'bitaog'), (SELECT id FROM municipalities WHERE name = 'General Luna')),
  ((SELECT id FROM species WHERE slug = 'bitaog'), (SELECT id FROM municipalities WHERE name = 'Socorro')),
  ((SELECT id FROM species WHERE slug = 'bitaog'), (SELECT id FROM municipalities WHERE name = 'Burgos')),
  ((SELECT id FROM species WHERE slug = 'bougainvillea'), (SELECT id FROM municipalities WHERE name = 'General Luna')),
  ((SELECT id FROM species WHERE slug = 'bougainvillea'), (SELECT id FROM municipalities WHERE name = 'Dapa'));

INSERT INTO species_photos (species_id, src, caption, sort_order) VALUES
  ((SELECT id FROM species WHERE slug = 'gumamela'), 'gumamela-1.jpg', 'Roadside hedge, General Luna', 0),
  ((SELECT id FROM species WHERE slug = 'bakhaw'), 'bakhaw-1.jpg', 'Stilt roots at low tide, Del Carmen', 0),
  ((SELECT id FROM species WHERE slug = 'sampaguita'), 'sampaguita-1.jpg', 'Garden shrub, Dapa', 0),
  ((SELECT id FROM species WHERE slug = 'kalachuchi'), 'kalachuchi-1.jpg', 'Beachfront resort, General Luna', 0),
  ((SELECT id FROM species WHERE slug = 'ylang-ylang'), 'ylang-ylang-1.jpg', 'Farm edge, San Isidro', 0),
  ((SELECT id FROM species WHERE slug = 'waling-waling'), 'waling-waling-1.jpg', 'Cultivated specimen', 0),
  ((SELECT id FROM species WHERE slug = 'nipa'), 'nipa-1.jpg', 'Riverbank, San Benito', 0),
  ((SELECT id FROM species WHERE slug = 'lubi'), 'lubi-1.jpg', 'Coconut road, General Luna', 0),
  ((SELECT id FROM species WHERE slug = 'talisay'), 'talisay-1.jpg', 'Shade tree by the beach, Burgos', 0),
  ((SELECT id FROM species WHERE slug = 'lambayong'), 'lambayong-1.jpg', 'Sand dune, Santa Monica', 0),
  ((SELECT id FROM species WHERE slug = 'pandan-dagat'), 'pandan-dagat-1.jpg', 'Rocky shore, Pilar', 0),
  ((SELECT id FROM species WHERE slug = 'banaba'), 'banaba-1.jpg', 'School grounds, Dapa', 0),
  ((SELECT id FROM species WHERE slug = 'santan'), 'santan-1.jpg', 'Plaza border, Dapa', 0),
  ((SELECT id FROM species WHERE slug = 'bitaog'), 'bitaog-1.jpg', 'Beach forest, Socorro', 0),
  ((SELECT id FROM species WHERE slug = 'bougainvillea'), 'bougainvillea-1.jpg', 'Café wall, General Luna', 0);

INSERT INTO species_videos (species_id, src, title, sort_order) VALUES
  ((SELECT id FROM species WHERE slug = 'bakhaw'), 'bakhaw-boardwalk.mp4', 'Mangrove boardwalk, Del Carmen', 0),
  ((SELECT id FROM species WHERE slug = 'nipa'), 'nipa-river.mp4', 'Nipa along the river, San Benito', 0),
  ((SELECT id FROM species WHERE slug = 'lubi'), 'coconut-road.mp4', 'Coconut road drive', 0);

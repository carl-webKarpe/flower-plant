-- =========================================================
--  Siargao Flora · MySQL database
--  Run this whole script in MySQL Workbench (lightning-bolt "Execute" button).
--  It creates the `lunhaw` database, all tables, the plant groups and the municipalities.
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

-- Videos: `src` is a file name in assets/videos/, a full URL, or a YouTube link.
-- species_id may be NULL for general field footage (e.g. a garden tour) not tied to one species.
-- `poster` is an optional cover image file name in assets/videos/.
CREATE TABLE species_videos (
  id           INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  species_id   INT UNSIGNED NULL,
  src          VARCHAR(255) NOT NULL,
  title        VARCHAR(255) NULL,
  description  VARCHAR(255) NULL,
  poster       VARCHAR(255) NULL,
  sort_order   INT NOT NULL DEFAULT 0,
  CONSTRAINT fk_video_species FOREIGN KEY (species_id) REFERENCES species(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ---------------------------------------------------------
--  Lookup data (plant groups and municipalities)
--  Species are added from the website (Manage data page) or with INSERTs.
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

-- General field footage (not tied to one species)
INSERT INTO species_videos (species_id, src, title, description, poster, sort_order) VALUES
  (NULL, 'garden-tour.mp4', 'Garden tour', 'Aglaonema, Dendrobium orchid, Dieffenbachia and sugarcane', 'garden-tour.jpg', 0);

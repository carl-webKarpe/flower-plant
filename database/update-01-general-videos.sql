-- =========================================================
--  Siargao Flora · database update 01
--  For databases created BEFORE general videos were supported.
--  Safe to run on your existing data: it only changes the
--  species_videos table and adds the garden tour video.
--  (Run this ONCE in MySQL Workbench. Not needed if you just ran lunhaw.sql.)
-- =========================================================
USE lunhaw;

ALTER TABLE species_videos
  MODIFY species_id INT UNSIGNED NULL,
  ADD COLUMN description VARCHAR(255) NULL AFTER title,
  ADD COLUMN poster VARCHAR(255) NULL AFTER description;

INSERT INTO species_videos (species_id, src, title, description, poster, sort_order) VALUES
  (NULL, 'garden-tour.mp4', 'Garden tour', 'Aglaonema, Dendrobium orchid, Dieffenbachia and sugarcane', 'garden-tour.jpg', 0);

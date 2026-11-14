-- =========================================================
--  Siargao Flora · database update 02
--  Deletes ALL species (the demo records) together with their
--  municipality links, photos and videos (ON DELETE CASCADE).
--  Keeps: plant groups, municipalities and general field footage
--  such as the garden tour video.
--  Run ONCE in MySQL Workbench before entering your real data.
-- =========================================================
USE lunhaw;

SET SQL_SAFE_UPDATES = 0;   -- Workbench blocks DELETE without a key column in WHERE unless this is off

DELETE FROM species;
ALTER TABLE species AUTO_INCREMENT = 1;

SET SQL_SAFE_UPDATES = 1;

-- Check: should show 0 species, 6 categories, 9 municipalities, and the general videos
SELECT (SELECT COUNT(*) FROM species)        AS species,
       (SELECT COUNT(*) FROM categories)     AS categories,
       (SELECT COUNT(*) FROM municipalities) AS municipalities,
       (SELECT COUNT(*) FROM species_videos) AS general_videos;

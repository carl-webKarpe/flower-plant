-- =========================================================
--  Siargao Flora · database update 04
--  Adds two general field videos: Ornamental garden and Plant nursery.
--  Safe to run more than once (removes the two rows first, then adds them).
-- =========================================================
USE lunhaw;
SET NAMES utf8mb4;
SET SQL_SAFE_UPDATES = 0;
DELETE FROM species_videos WHERE src IN ('ornamental-garden.mp4', 'plant-nursery.mp4');
SET SQL_SAFE_UPDATES = 1;

INSERT INTO species_videos (species_id, src, title, description, poster, sort_order) VALUES
  (NULL, 'ornamental-garden.mp4', 'Ornamental garden', 'Bromeliads, anthurium, fan palm and hanging plants', 'ornamental-garden.jpg', 1),
  (NULL, 'plant-nursery.mp4', 'Plant nursery', 'Potted bougainvillea and young plants in nursery bags', 'plant-nursery.jpg', 2);

-- Check: should list the garden tour and the two new videos
SELECT title, src FROM species_videos WHERE species_id IS NULL ORDER BY sort_order;

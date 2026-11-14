-- =========================================================
--  Siargao Flora · database update 05
--  Adds the second batch of 10 field plants (docs/PlantsInfo-2.docx)
--  and the new plant groups Fruit and Palm.
--  Keeps the first 10 plants. Safe to run more than once.
--  Run after update-03.
-- =========================================================
USE lunhaw;
SET NAMES utf8mb4;
SET SQL_SAFE_UPDATES = 0;
DELETE FROM species WHERE slug IN ('maguey', 'sahod-yaman', 'baging-baging', 'umbrella-plant', 'bromeliad', 'kapayas', 'bayabas', 'dragon-fruit', 'niyog', 'kawayan');
SET SQL_SAFE_UPDATES = 1;

INSERT IGNORE INTO categories (name, blurb) VALUES
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

-- Check: should show 20 species and 5 plant groups
SELECT (SELECT COUNT(*) FROM species) AS species,
       (SELECT COUNT(*) FROM categories) AS categories,
       (SELECT COUNT(*) FROM species_photos) AS photos;

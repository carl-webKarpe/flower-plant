<?php
/**
 * GET /api/categories.php  → { "data": [ { "name": "Flower", "blurb": "...", "species_count": 5 }, ... ] }
 */
require __DIR__ . '/db.php';

run(function () {
    if ($_SERVER['REQUEST_METHOD'] !== 'GET') fail('Method not allowed.', 405);
    $rows = db()->query(
        'SELECT c.name, c.blurb, COUNT(s.id) AS species_count
           FROM categories c LEFT JOIN species s ON s.category_id = c.id
          GROUP BY c.id ORDER BY c.id'
    )->fetchAll();
    foreach ($rows as &$r) $r['species_count'] = (int) $r['species_count'];
    respond(['data' => $rows]);
});

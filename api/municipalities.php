<?php
/**
 * GET /api/municipalities.php  → { "data": [ "Burgos", "Dapa", ... ] }
 */
require __DIR__ . '/db.php';

run(function () {
    if ($_SERVER['REQUEST_METHOD'] !== 'GET') fail('Method not allowed.', 405);
    $names = db()->query('SELECT name FROM municipalities ORDER BY name')->fetchAll(PDO::FETCH_COLUMN);
    respond(['data' => $names]);
});

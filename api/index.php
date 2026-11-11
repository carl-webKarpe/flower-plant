<?php
/**
 * GET /api/  → health check: confirms PHP can reach the database.
 */
require __DIR__ . '/db.php';

run(function () {
    $count = (int) db()->query('SELECT COUNT(*) FROM species')->fetchColumn();
    respond([
        'name'      => 'Siargao Flora REST API',
        'status'    => 'ok',
        'database'  => 'connected',
        'species'   => $count,
        'endpoints' => [
            'GET    api/species.php'                  => 'List species (?q=, ?category=, ?municipality=)',
            'GET    api/species.php?id={slug}'        => 'One species',
            'POST   api/species.php'                  => 'Create species (X-API-Key)',
            'PUT    api/species.php?id={slug}'        => 'Update species (X-API-Key)',
            'DELETE api/species.php?id={slug}'        => 'Delete species (X-API-Key)',
            'GET    api/categories.php'               => 'Plant groups',
            'GET    api/municipalities.php'           => 'Municipalities',
            'GET    api/videos.php'                   => 'All videos, incl. general field footage (?species=)',
        ],
    ]);
});

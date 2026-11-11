<?php
/**
 * GET /api/videos.php → every video, general field footage first.
 * { "data": [ { "src", "title", "description", "poster",
 *               "species": { "id", "local_name", "scientific_name", "category", "color" } | null }, ... ] }
 * Optional: ?species={slug} to list one species' videos only.
 */
require __DIR__ . '/db.php';

run(function () {
    if ($_SERVER['REQUEST_METHOD'] !== 'GET') fail('Method not allowed.', 405);

    $sql = 'SELECT v.src, v.title, ' . video_extra_columns('v') . ','
                   . ' s.slug, s.local_name, s.scientific_name, s.color, c.name AS category
              FROM species_videos v
              LEFT JOIN species s ON s.id = v.species_id
              LEFT JOIN categories c ON c.id = s.category_id';
    $args = [];
    if (!empty($_GET['species'])) {
        $sql .= ' WHERE s.slug = ?';
        $args[] = $_GET['species'];
    }
    $sql .= ' ORDER BY (v.species_id IS NOT NULL), v.sort_order, v.id';

    $st = db()->prepare($sql);
    $st->execute($args);
    $out = array_map(function ($r) {
        return [
            'src'         => $r['src'],
            'title'       => $r['title'],
            'description' => $r['description'],
            'poster'      => $r['poster'],
            'species'     => $r['slug'] === null ? null : [
                'id'              => $r['slug'],
                'local_name'      => $r['local_name'],
                'scientific_name' => $r['scientific_name'],
                'category'        => $r['category'],
                'color'           => $r['color'],
            ],
        ];
    }, $st->fetchAll());
    respond(['data' => $out, 'count' => count($out)]);
});

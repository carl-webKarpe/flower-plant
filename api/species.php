<?php
/**
 * Species endpoint.
 *
 *   GET    /api/species.php                       list (filters: q, category, municipality)
 *   GET    /api/species.php?id=gumamela           one species
 *   POST   /api/species.php                       create   (JSON body, X-API-Key header)
 *   PUT    /api/species.php?id=gumamela           update   (JSON body, X-API-Key header)
 *   DELETE /api/species.php?id=gumamela           delete   (X-API-Key header)
 *
 * Each species is returned in the shape the website expects:
 * { id, local_name, common_name, scientific_name, family, category, color, native, status,
 *   municipalities: [], habitat, blooming, uses, description,
 *   photos: [{src, caption}], videos: [{src, title}], date_added }
 */
require __DIR__ . '/db.php';

const SPECIES_SELECT = '
  SELECT s.id AS pk, s.slug, s.local_name, s.common_name, s.scientific_name, s.family,
         c.name AS category, s.color, s.is_native, s.status, s.habitat, s.blooming,
         s.uses, s.description, s.date_added
    FROM species s
    JOIN categories c ON c.id = s.category_id';

/** Attach municipalities, photos and videos to species rows and format them for JSON. */
function hydrate(array $rows): array
{
    if (!$rows) return [];
    $ids = array_column($rows, 'pk');
    $in  = implode(',', array_fill(0, count($ids), '?'));
    $pdo = db();

    $group = function (string $sql) use ($pdo, $ids): array {
        $st = $pdo->prepare($sql);
        $st->execute($ids);
        $out = [];
        foreach ($st->fetchAll() as $r) {
            $sid = $r['species_id'];
            unset($r['species_id']);
            $out[$sid][] = $r;
        }
        return $out;
    };

    $munis  = $group("SELECT sm.species_id, m.name FROM species_municipalities sm
                        JOIN municipalities m ON m.id = sm.municipality_id
                       WHERE sm.species_id IN ($in) ORDER BY m.name");
    $photos = $group("SELECT species_id, src, caption FROM species_photos
                       WHERE species_id IN ($in) ORDER BY sort_order, id");
    $videos = $group("SELECT species_id, src, title, " . video_extra_columns() . " FROM species_videos
                       WHERE species_id IN ($in) ORDER BY sort_order, id");

    return array_map(function ($r) use ($munis, $photos, $videos) {
        $pk = $r['pk'];
        return [
            'id'              => $r['slug'],
            'local_name'      => $r['local_name'],
            'common_name'     => $r['common_name'],
            'scientific_name' => $r['scientific_name'],
            'family'          => $r['family'],
            'category'        => $r['category'],
            'color'           => $r['color'],
            'native'          => (bool) $r['is_native'],
            'status'          => $r['status'],
            'municipalities'  => array_column($munis[$pk] ?? [], 'name'),
            'habitat'         => $r['habitat'],
            'blooming'        => $r['blooming'],
            'uses'            => $r['uses'],
            'description'     => $r['description'],
            'photos'          => $photos[$pk] ?? [],
            'videos'          => $videos[$pk] ?? [],
            'date_added'      => $r['date_added'],
        ];
    }, $rows);
}

function find_by_slug(string $slug): ?array
{
    $st = db()->prepare(SPECIES_SELECT . ' WHERE s.slug = ?');
    $st->execute([$slug]);
    $row = $st->fetch();
    return $row ? hydrate([$row])[0] : null;
}

function slug_param(): string
{
    $slug = strtolower(trim((string) ($_GET['id'] ?? '')));
    return preg_replace('/[^a-z0-9\-]/', '', $slug);
}

function slugify(string $text): string
{
    $s = strtolower(trim(preg_replace('/[^A-Za-z0-9]+/', '-', $text), '-'));
    return $s !== '' ? $s : 'species-' . time();
}

function category_id(string $name): int
{
    $st = db()->prepare('SELECT id FROM categories WHERE name = ?');
    $st->execute([$name]);
    $id = $st->fetchColumn();
    if ($id === false) fail("Unknown category \"$name\".", 422);
    return (int) $id;
}

/** Replace a species' municipalities / photos / videos when those keys are present in the body. */
function save_relations(int $pk, array $in): void
{
    $pdo = db();
    if (array_key_exists('municipalities', $in)) {
        $pdo->prepare('DELETE FROM species_municipalities WHERE species_id = ?')->execute([$pk]);
        $find = $pdo->prepare('SELECT id FROM municipalities WHERE name = ?');
        $ins  = $pdo->prepare('INSERT INTO species_municipalities (species_id, municipality_id) VALUES (?, ?)');
        foreach ((array) $in['municipalities'] as $name) {
            $find->execute([$name]);
            $mid = $find->fetchColumn();
            if ($mid === false) fail("Unknown municipality \"$name\".", 422);
            $ins->execute([$pk, $mid]);
        }
    }
    if (array_key_exists('photos', $in)) {
        $pdo->prepare('DELETE FROM species_photos WHERE species_id = ?')->execute([$pk]);
        $ins = $pdo->prepare('INSERT INTO species_photos (species_id, src, caption, sort_order) VALUES (?, ?, ?, ?)');
        foreach (array_values((array) $in['photos']) as $i => $p) {
            if (empty($p['src'])) continue;
            $ins->execute([$pk, $p['src'], $p['caption'] ?? null, $i]);
        }
    }
    if (array_key_exists('videos', $in)) {
        $pdo->prepare('DELETE FROM species_videos WHERE species_id = ?')->execute([$pk]);
        $extra = has_column('species_videos', 'poster');
        $ins = $extra
            ? $pdo->prepare('INSERT INTO species_videos (species_id, src, title, description, poster, sort_order) VALUES (?, ?, ?, ?, ?, ?)')
            : $pdo->prepare('INSERT INTO species_videos (species_id, src, title, sort_order) VALUES (?, ?, ?, ?)');
        foreach (array_values((array) $in['videos']) as $i => $v) {
            if (empty($v['src'])) continue;
            $ins->execute($extra
                ? [$pk, $v['src'], $v['title'] ?? null, $v['description'] ?? null, $v['poster'] ?? null, $i]
                : [$pk, $v['src'], $v['title'] ?? null, $i]);
        }
    }
}

/** Map JSON body keys to species table columns. */
function column_values(array $in): array
{
    $map = [
        'local_name' => 'local_name', 'common_name' => 'common_name', 'scientific_name' => 'scientific_name',
        'family' => 'family', 'color' => 'color', 'status' => 'status', 'habitat' => 'habitat',
        'blooming' => 'blooming', 'uses' => 'uses', 'description' => 'description', 'date_added' => 'date_added',
    ];
    $cols = [];
    foreach ($map as $key => $col) {
        if (array_key_exists($key, $in)) $cols[$col] = $in[$key];
    }
    if (array_key_exists('native', $in))   $cols['is_native'] = $in['native'] ? 1 : 0;
    if (array_key_exists('category', $in)) $cols['category_id'] = category_id((string) $in['category']);
    if (isset($cols['color']) && !preg_match('/^#[0-9a-fA-F]{6}$/', (string) $cols['color'])) {
        fail('color must be a hex value like #d8342b.', 422);
    }
    return $cols;
}

run(function () {
    $pdo = db();
    $method = $_SERVER['REQUEST_METHOD'];

    /* ---------- READ ---------- */
    if ($method === 'GET') {
        if (isset($_GET['id'])) {
            $sp = find_by_slug(slug_param());
            if (!$sp) fail('Species not found.', 404);
            respond(['data' => $sp]);
        }

        $where = [];
        $args = [];
        if (!empty($_GET['q'])) {
            $where[] = '(s.local_name LIKE ? OR s.common_name LIKE ? OR s.scientific_name LIKE ? OR s.family LIKE ?)';
            $like = '%' . $_GET['q'] . '%';
            array_push($args, $like, $like, $like, $like);
        }
        if (!empty($_GET['category'])) {
            $where[] = 'c.name = ?';
            $args[] = $_GET['category'];
        }
        if (!empty($_GET['municipality'])) {
            $where[] = 's.id IN (SELECT sm.species_id FROM species_municipalities sm
                                   JOIN municipalities m ON m.id = sm.municipality_id WHERE m.name = ?)';
            $args[] = $_GET['municipality'];
        }
        $sql = SPECIES_SELECT . ($where ? ' WHERE ' . implode(' AND ', $where) : '') . ' ORDER BY s.local_name';
        $st = $pdo->prepare($sql);
        $st->execute($args);
        $list = hydrate($st->fetchAll());
        respond(['data' => $list, 'count' => count($list)]);
    }

    /* ---------- CREATE ---------- */
    if ($method === 'POST') {
        require_api_key();
        $in = body();
        foreach (['local_name', 'scientific_name', 'category'] as $req) {
            if (empty($in[$req])) fail("Field \"$req\" is required.", 422);
        }
        $slug = slugify((string) ($in['id'] ?? $in['local_name']));
        if (find_by_slug($slug)) fail("A species with id \"$slug\" already exists.", 409);

        $cols = column_values($in) + ['slug' => $slug];
        if (!isset($cols['date_added'])) $cols['date_added'] = date('Y-m-d');

        $pdo->beginTransaction();
        $names = array_keys($cols);
        $sql = 'INSERT INTO species (' . implode(', ', $names) . ') VALUES (' . implode(', ', array_fill(0, count($names), '?')) . ')';
        $pdo->prepare($sql)->execute(array_values($cols));
        save_relations((int) $pdo->lastInsertId(), $in);
        $pdo->commit();
        respond(['data' => find_by_slug($slug), 'message' => 'Species created.'], 201);
    }

    /* ---------- UPDATE ---------- */
    if ($method === 'PUT' || $method === 'PATCH') {
        require_api_key();
        $slug = slug_param();
        $st = $pdo->prepare('SELECT id FROM species WHERE slug = ?');
        $st->execute([$slug]);
        $pk = $st->fetchColumn();
        if ($pk === false) fail('Species not found.', 404);

        $in = body();
        $cols = column_values($in);
        $pdo->beginTransaction();
        if ($cols) {
            $set = implode(', ', array_map(function ($c) { return "$c = ?"; }, array_keys($cols)));
            $pdo->prepare("UPDATE species SET $set WHERE id = ?")->execute([...array_values($cols), $pk]);
        }
        save_relations((int) $pk, $in);
        $pdo->commit();
        respond(['data' => find_by_slug($slug), 'message' => 'Species updated.']);
    }

    /* ---------- DELETE ---------- */
    if ($method === 'DELETE') {
        require_api_key();
        $st = $pdo->prepare('DELETE FROM species WHERE slug = ?');
        $st->execute([slug_param()]);
        if ($st->rowCount() === 0) fail('Species not found.', 404);
        respond(['message' => 'Species deleted.']);
    }

    fail('Method not allowed.', 405);
});

<?php
/**
 * Shared helpers for every endpoint: JSON responses, CORS, DB connection, request body.
 */
declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, X-API-Key');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

$CONFIG = require __DIR__ . '/config.php';

/** Send a JSON response and stop. */
function respond($data, int $status = 200): void
{
    http_response_code($status);
    echo json_encode($data, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES | JSON_PRETTY_PRINT);
    exit;
}

function fail(string $message, int $status = 400, array $extra = []): void
{
    respond(['error' => $message] + $extra, $status);
}

/** PDO connection (created once). */
function db(): PDO
{
    static $pdo = null;
    global $CONFIG;
    if ($pdo === null) {
        $dsn = sprintf('mysql:host=%s;port=%d;dbname=%s;charset=utf8mb4',
            $CONFIG['db_host'], $CONFIG['db_port'], $CONFIG['db_name']);
        try {
            $pdo = new PDO($dsn, $CONFIG['db_user'], $CONFIG['db_pass'], [
                PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                PDO::ATTR_EMULATE_PREPARES   => false,
            ]);
        } catch (PDOException $e) {
            fail('Database connection failed. Check api/config.php and that MySQL Server is running.', 500,
                ['details' => $e->getMessage()]);
        }
    }
    return $pdo;
}

/** Decoded JSON request body. */
function body(): array
{
    $raw = file_get_contents('php://input');
    if ($raw === '' || $raw === false) return [];
    $data = json_decode($raw, true);
    if (!is_array($data)) fail('Request body must be valid JSON.');
    return $data;
}

/** Write operations need the API key from config.php. */
function require_api_key(): void
{
    global $CONFIG;
    $key = $_SERVER['HTTP_X_API_KEY'] ?? '';
    if (!hash_equals((string) $CONFIG['api_key'], (string) $key)) {
        fail('Missing or invalid X-API-Key header.', 401);
    }
}

/** Run an endpoint body and turn unexpected DB errors into JSON. */
function run(callable $handler): void
{
    try {
        $handler();
    } catch (PDOException $e) {
        fail('Database error.', 500, ['details' => $e->getMessage()]);
    }
}

/** True if a column exists (lets the API work before/after optional database updates). */
function has_column(string $table, string $column): bool
{
    static $cache = [];
    $key = "$table.$column";
    if (!array_key_exists($key, $cache)) {
        $st = db()->prepare('SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
                              WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = ? AND COLUMN_NAME = ?');
        $st->execute([$table, $column]);
        $cache[$key] = (int) $st->fetchColumn() > 0;
    }
    return $cache[$key];
}

/** SELECT list for the optional video columns (NULL when update-01 hasn't been run yet). */
function video_extra_columns(string $alias = ''): string
{
    $p = $alias ? "$alias." : '';
    $desc = has_column('species_videos', 'description') ? "{$p}description" : 'NULL AS description';
    $poster = has_column('species_videos', 'poster') ? "{$p}poster" : 'NULL AS poster';
    return "$desc, $poster";
}


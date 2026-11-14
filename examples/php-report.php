<?php
/**
 * REUSE DEMO 2 — Server-side PHP report
 * A separate PHP application that gets its data from the Siargao Flora REST API over HTTP
 * (it does NOT connect to the database), then builds summary statistics from the JSON.
 */

// Address of the API, worked out from where this file is served (e.g. http://localhost/flower&plant/api)
$scheme  = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') ? 'https' : 'http';
$siteDir = rtrim(dirname(dirname($_SERVER['SCRIPT_NAME'])), '/\\');
$apiBase = $scheme . '://' . $_SERVER['HTTP_HOST'] . str_replace(' ', '%20', $siteDir) . '/api';

/** Call the API with an HTTP GET request and decode the JSON response. */
function api_get(string $url): array
{
    if (function_exists('curl_init')) {
        $ch = curl_init($url);
        curl_setopt_array($ch, [CURLOPT_RETURNTRANSFER => true, CURLOPT_TIMEOUT => 10, CURLOPT_HTTPHEADER => ['Accept: application/json']]);
        $body = curl_exec($ch);
        $code = (int) curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);
    } else {
        $ctx  = stream_context_create(['http' => ['timeout' => 10, 'ignore_errors' => true, 'header' => "Accept: application/json\r\n"]]);
        $body = @file_get_contents($url, false, $ctx);
        $code = isset($http_response_header[0]) && preg_match('/\s(\d{3})\s/', $http_response_header[0], $m) ? (int) $m[1] : 0;
    }
    if ($body === false || $code !== 200) {
        throw new RuntimeException("Request to $url failed (HTTP $code)");
    }
    $json = json_decode($body, true);
    if (!is_array($json)) throw new RuntimeException("Invalid JSON from $url");
    return $json['data'] ?? $json;
}

$error = null;
$requests = [];
try {
    $requests[] = $apiBase . '/species.php';
    $species = api_get($apiBase . '/species.php');
    $requests[] = $apiBase . '/municipalities.php';
    $municipalities = api_get($apiBase . '/municipalities.php');

    // --- build statistics from the JSON ---
    $byCategory = [];
    $byTown = array_fill_keys($municipalities, 0);
    $native = 0;
    $photos = 0;
    $videos = 0;
    foreach ($species as $s) {
        $byCategory[$s['category']] = ($byCategory[$s['category']] ?? 0) + 1;
        foreach ($s['municipalities'] as $m) $byTown[$m] = ($byTown[$m] ?? 0) + 1;
        if ($s['native']) $native++;
        $photos += count($s['photos']);
        $videos += count($s['videos']);
    }
    arsort($byCategory);
    arsort($byTown);
} catch (Throwable $e) {
    $error = $e->getMessage();
}
$h = fn($v) => htmlspecialchars((string) $v, ENT_QUOTES, 'UTF-8');
?>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Flora Report — built from the Siargao Flora API</title>
  <style>
    body { margin: 0; font: 15px/1.5 'Segoe UI', system-ui, sans-serif; color: #1d2733; background: #eef2f7; }
    header { background: #1d3557; color: #fff; padding: 28px 24px; }
    header h1 { margin: 0 0 4px; font-size: 1.6rem; }
    header p { margin: 0; opacity: .75; }
    main { max-width: 980px; margin: 0 auto; padding: 24px 16px 48px; }
    .kpis { display: grid; grid-template-columns: repeat(auto-fit, minmax(160px, 1fr)); gap: 12px; margin-bottom: 20px; }
    .kpi { background: #fff; border-radius: 10px; padding: 16px; border-left: 4px solid #457b9d; }
    .kpi b { display: block; font-size: 1.8rem; color: #1d3557; }
    .grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 16px; }
    section { background: #fff; border-radius: 10px; padding: 18px; }
    h2 { margin: 0 0 12px; font-size: 1.05rem; color: #1d3557; }
    table { width: 100%; border-collapse: collapse; }
    td, th { padding: 7px 4px; border-bottom: 1px solid #e4e9f0; text-align: left; }
    th { font-size: .75rem; text-transform: uppercase; letter-spacing: .05em; color: #6b7785; }
    .bar { height: 8px; border-radius: 4px; background: #457b9d; }
    .full { grid-column: 1 / -1; overflow-x: auto; }
    section { min-width: 0; }
    code { background: #eef2f7; padding: 2px 6px; border-radius: 4px; font-size: .85em; }
    .error { background: #fde7e3; color: #9b2c1b; padding: 16px; border-radius: 10px; }
  </style>
</head>
<body>
<header>
  <h1>Flora Report</h1>
  <p>A separate PHP application. Its data comes only from the Siargao Flora REST API (JSON over HTTP).</p>
</header>
<main>
<?php if ($error): ?>
  <div class="error"><b>Could not reach the API.</b><br><?= $h($error) ?><br>Make sure Apache is running and <code><?= $h($apiBase) ?>/</code> opens in your browser.</div>
<?php else: $maxTown = max(1, ...array_values($byTown)); ?>
  <div class="kpis">
    <div class="kpi"><b><?= count($species) ?></b>species</div>
    <div class="kpi"><b><?= $native ?></b>native to the Philippines</div>
    <div class="kpi"><b><?= count($byCategory) ?></b>plant groups</div>
    <div class="kpi"><b><?= $photos ?> / <?= $videos ?></b>photos / videos</div>
  </div>
  <div class="grid">
    <section>
      <h2>Species per municipality</h2>
      <table>
        <tr><th>Municipality</th><th>Species</th><th style="width:45%"></th></tr>
        <?php foreach ($byTown as $town => $n): ?>
          <tr><td><?= $h($town) ?></td><td><?= $n ?></td><td><div class="bar" style="width:<?= round($n / $maxTown * 100) ?>%"></div></td></tr>
        <?php endforeach; ?>
      </table>
    </section>
    <section>
      <h2>Species per plant group</h2>
      <table>
        <tr><th>Group</th><th>Species</th></tr>
        <?php foreach ($byCategory as $cat => $n): ?><tr><td><?= $h($cat) ?></td><td><?= $n ?></td></tr><?php endforeach; ?>
      </table>
    </section>
    <section class="full">
      <h2>All species (A–Z)</h2>
      <table>
        <tr><th>Local name</th><th>Scientific name</th><th>Family</th><th>Status</th><th>Towns</th></tr>
        <?php foreach ($species as $s): ?>
          <tr><td><?= $h($s['local_name']) ?></td><td><i><?= $h($s['scientific_name']) ?></i></td><td><?= $h($s['family']) ?></td>
              <td><?= $h($s['status']) ?></td><td><?= count($s['municipalities']) ?></td></tr>
        <?php endforeach; ?>
      </table>
    </section>
    <section class="full">
      <h2>API requests made by this page</h2>
      <?php foreach ($requests as $r): ?><div><code>GET <?= $h($r) ?></code></div><?php endforeach; ?>
    </section>
  </div>
<?php endif; ?>
</main>
</body>
</html>

<?php
  // Detail page. The id comes from the query string; JS fetches the record (mock now, REST API later).
  $speciesId  = isset($_GET['id']) ? preg_replace('/[^a-z0-9\-]/', '', strtolower($_GET['id'])) : '';
  $pageTitle  = 'Species — Lunhaw';
  $activePage = 'explore';
  $navLight   = true;
  include 'includes/header.php';
?>

<main id="speciesPage" data-id="<?= htmlspecialchars($speciesId) ?>">
  <div class="container detail-loading" id="detailLoading">Loading species…</div>
</main>

<?php include 'includes/footer.php'; ?>

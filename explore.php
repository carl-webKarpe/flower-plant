<?php
  $pageTitle  = 'Explore species — Lunhaw';
  $activePage = 'explore';
  $navLight   = true;
  include 'includes/header.php';
?>

<section class="page-head container">
  <p class="eyebrow"><span class="dot"></span> Field guide</p>
  <h1 class="page-title">Explore the <em>flora</em><br>of Siargao.</h1>
  <p class="muted page-lead">Search by local or scientific name, or filter by plant group and the town where it was recorded.</p>
</section>

<section class="filters-wrap">
  <div class="container filters">
    <label class="search-field">
      <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>
      <input type="search" id="q" placeholder="Try “gumamela” or “Rhizophora”" autocomplete="off">
    </label>
    <div class="chips" id="categoryChips" role="tablist" aria-label="Plant group"></div>
    <div class="selects">
      <select id="muni" aria-label="Municipality"><option value="">All municipalities</option></select>
      <select id="sort" aria-label="Sort">
        <option value="name">Sort: A–Z</option>
        <option value="sci">Sort: Scientific name</option>
        <option value="recent">Sort: Recently added</option>
      </select>
    </div>
  </div>
</section>

<section class="section section--tight">
  <div class="container">
    <div class="result-bar">
      <p id="resultCount" class="muted">Loading…</p>
      <button class="link-btn" id="resetFilters" hidden>Clear filters ×</button>
    </div>
    <div class="card-grid" id="speciesGrid"></div>
    <div class="empty" id="emptyState" hidden>
      <div class="empty__art" id="emptyArt"></div>
      <h3>No species match that search.</h3>
      <p class="muted">Try a different name, or clear the filters. Our team is still adding species from the field.</p>
    </div>
  </div>
</section>

<?php include 'includes/footer.php'; ?>

<?php
  $pageTitle  = 'Species directory — Lunhaw';
  $activePage = 'explore';
  $navLight   = true;
  include 'includes/header.php';
?>

<section class="page-header">
  <div class="container">
    <nav class="crumbs" aria-label="Breadcrumb"><a href="index.php">Home</a><span>/</span><span>Species</span></nav>
    <h1 class="page-title">Species directory</h1>
    <p class="page-lead">Search and filter every flower and plant recorded on Siargao Island.</p>
  </div>
</section>

<section class="section section--flush">
  <div class="container directory">
    <aside class="filters" id="filters">
      <div class="filters__head">
        <h2>Filters</h2>
        <button class="link-btn" id="resetFilters" type="button">Reset</button>
      </div>

      <div class="filter-group">
        <label class="filter-label" for="q">Search</label>
        <div class="input-icon">
          <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>
          <input type="search" id="q" placeholder="Search by name" autocomplete="off">
        </div>
      </div>

      <div class="filter-group">
        <span class="filter-label">Plant group</span>
        <div class="option-list" id="categoryList"></div>
      </div>

      <div class="filter-group">
        <label class="filter-label" for="muni">Municipality</label>
        <select id="muni" class="select"><option value="">All municipalities</option></select>
      </div>

      <div class="filter-group">
        <span class="filter-label">Origin</span>
        <div class="segmented" id="originSeg">
          <button type="button" data-origin="" class="is-active">All</button>
          <button type="button" data-origin="native">Native</button>
          <button type="button" data-origin="introduced">Introduced</button>
        </div>
      </div>
    </aside>

    <div class="directory__main">
      <div class="toolbar">
        <button class="btn btn--outline btn--sm filters-toggle" id="filtersToggle" type="button">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 6h16M7 12h10M10 18h4"/></svg> Filters
        </button>
        <p id="resultCount" class="toolbar__count">Loading…</p>
        <div class="toolbar__right">
          <select id="sort" class="select select--sm" aria-label="Sort">
            <option value="name">Name (A–Z)</option>
            <option value="sci">Scientific name</option>
            <option value="recent">Recently added</option>
          </select>
          <div class="view-toggle" role="group" aria-label="View">
            <button type="button" data-view="grid" class="is-active" aria-label="Grid view"><svg viewBox="0 0 24 24"><rect x="4" y="4" width="7" height="7" rx="1.5"/><rect x="13" y="4" width="7" height="7" rx="1.5"/><rect x="4" y="13" width="7" height="7" rx="1.5"/><rect x="13" y="13" width="7" height="7" rx="1.5"/></svg></button>
            <button type="button" data-view="list" aria-label="List view"><svg viewBox="0 0 24 24"><path d="M4 6h16M4 12h16M4 18h16"/></svg></button>
          </div>
        </div>
      </div>
      <div class="active-filters" id="activeFilters"></div>

      <div class="card-grid card-grid--3" id="speciesGrid"></div>
      <div class="empty" id="emptyState" hidden>
        <div class="empty__icon"><svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg></div>
        <h3>No species found</h3>
        <p class="muted">Try another name or remove some filters. New species are added as field work continues.</p>
        <button class="btn btn--dark btn--sm" id="emptyReset" type="button">Clear all filters</button>
      </div>
    </div>
  </div>
</section>

<?php include 'includes/footer.php'; ?>

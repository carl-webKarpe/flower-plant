<?php
  $pageTitle  = 'Gallery — Siargao Flora';
  $activePage = 'gallery';
  $navLight   = true;
  include 'includes/header.php';
?>

<section class="page-header">
  <div class="container page-header__row">
    <div>
      <nav class="crumbs" aria-label="Breadcrumb"><a href="index.php">Home</a><span>/</span><span>Gallery</span></nav>
      <h1 class="page-title">Photos &amp; field videos</h1>
      <p class="page-lead">Media captured on Siargao Island during our data gathering. Select any item to view it.</p>
    </div>
    <div class="segmented segmented--lg" id="mediaTabs">
      <button type="button" class="is-active" data-media="all">All</button>
      <button type="button" data-media="photo">Photos</button>
      <button type="button" data-media="video">Videos</button>
    </div>
  </div>
</section>

<section class="section section--flush">
  <div class="container">
    <div class="masonry" id="masonry"></div>
  </div>
</section>

<!-- Viewer: media on the left, plant information on the right (stacked on small screens) -->
<div class="lightbox" id="lightbox" hidden role="dialog" aria-modal="true" aria-label="Media viewer">
  <div class="viewer" id="viewer">
    <div class="viewer__media">
      <div class="viewer__stage" id="lightboxStage"></div>
      <button type="button" class="viewer__nav viewer__nav--prev" id="lbPrev" aria-label="Previous">
        <svg viewBox="0 0 24 24"><path d="m15 6-6 6 6 6"/></svg>
      </button>
      <button type="button" class="viewer__nav viewer__nav--next" id="lbNext" aria-label="Next">
        <svg viewBox="0 0 24 24"><path d="m9 6 6 6-6 6"/></svg>
      </button>
      <span class="viewer__count" id="lbCount"></span>
    </div>
    <aside class="viewer__info" id="lightboxInfo"></aside>
    <button type="button" class="viewer__close" id="lightboxClose" aria-label="Close">
      <svg viewBox="0 0 24 24"><path d="M6 6l12 12M18 6 6 18"/></svg>
    </button>
  </div>
</div>

<?php include 'includes/footer.php'; ?>

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

<div class="lightbox" id="lightbox" hidden role="dialog" aria-modal="true">
  <button class="lightbox__close" id="lightboxClose" aria-label="Close">×</button>
  <div class="lightbox__inner">
    <div class="lightbox__stage" id="lightboxStage"></div>
    <div class="lightbox__caption" id="lightboxCaption"></div>
  </div>
</div>

<?php include 'includes/footer.php'; ?>

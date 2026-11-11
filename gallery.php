<?php
  $pageTitle  = 'Photos & videos — Lunhaw';
  $activePage = 'gallery';
  $navLight   = true;
  include 'includes/header.php';
?>

<section class="page-head container">
  <p class="eyebrow"><span class="dot"></span> Media</p>
  <h1 class="page-title">Photos &amp; <em>field videos</em>.</h1>
  <p class="muted page-lead">Every image and clip here was captured on Siargao Island during our data gathering. Tap any item to view it larger.</p>
  <div class="chips" id="mediaTabs">
    <button class="chip is-active" data-media="all">All</button>
    <button class="chip" data-media="photo">Photos</button>
    <button class="chip" data-media="video">Videos</button>
  </div>
</section>

<section class="section section--tight">
  <div class="container">
    <div class="masonry" id="masonry"></div>
  </div>
</section>

<div class="lightbox" id="lightbox" hidden>
  <button class="lightbox__close" id="lightboxClose" aria-label="Close">×</button>
  <div class="lightbox__stage" id="lightboxStage"></div>
  <div class="lightbox__caption" id="lightboxCaption"></div>
</div>

<?php include 'includes/footer.php'; ?>

<?php
  $pageTitle  = 'About — Lunhaw';
  $activePage = 'about';
  $navLight   = true;
  include 'includes/header.php';
?>

<section class="page-head container">
  <p class="eyebrow"><span class="dot"></span> About the project</p>
  <h1 class="page-title">A living record of<br>what grows on <em>Siargao</em>.</h1>
</section>

<section class="section section--tight">
  <div class="container about-grid">
    <div class="about-art" id="aboutArt" aria-hidden="true"></div>
    <div class="prose">
      <p class="lead">Lunhaw is a web-based information system that documents the flowers and plants of
        Siargao Island, Surigao del Norte — built as our final project for <strong>System Integration and Architecture</strong>.</p>
      <p>Siargao is part of the Siargao Island Protected Landscapes and Seascapes, home to one of the largest
        mangrove forests in Mindanao. Beyond the surf breaks are coastal forests, wetlands and village gardens
        full of species many visitors never notice. We want people to know their names, where they grow and
        why they matter.</p>
      <p>The site is completely open: there is no login and no account. Anyone can browse, search and view
        photos and videos of the species we have recorded.</p>
    </div>
  </div>
</section>

<section class="section section--tint" id="method">
  <div class="container">
    <p class="eyebrow"><span class="dot"></span> How we gather data</p>
    <h2 class="h2">From the field to your screen</h2>
    <div class="steps">
      <div class="step"><span>01</span><h3>Field visits</h3><p>We visit barangays, shorelines and mangrove areas across the island’s municipalities.</p></div>
      <div class="step"><span>02</span><h3>Capture</h3><p>Each plant is photographed and filmed, with its location, habitat and blooming period noted.</p></div>
      <div class="step"><span>03</span><h3>Identify</h3><p>Local names come from residents; scientific names are checked against references.</p></div>
      <div class="step"><span>04</span><h3>Publish</h3><p>Records go into a MySQL database and are served through our PHP REST API to this website.</p></div>
    </div>
  </div>
</section>

<section class="section" id="api">
  <div class="container">
    <p class="eyebrow"><span class="dot"></span> System integration</p>
    <h2 class="h2">The Lunhaw REST API</h2>
    <p class="muted page-lead">This website does not talk to the database directly. It consumes our own REST API
      (PHP + MySQL), which returns JSON. The same endpoints can be used by any other app.</p>

    <div class="arch">
      <div class="arch__node"><b>Website</b><small>HTML · CSS · JS</small></div>
      <div class="arch__arrow">HTTP GET →<br><small>← JSON</small></div>
      <div class="arch__node arch__node--accent"><b>REST API</b><small>PHP</small></div>
      <div class="arch__arrow">SQL →<br><small>← rows</small></div>
      <div class="arch__node"><b>Database</b><small>MySQL</small></div>
    </div>

    <div class="table-wrap">
      <table class="api-table">
        <thead><tr><th>Method</th><th>Endpoint</th><th>Returns</th></tr></thead>
        <tbody>
          <tr><td><span class="method">GET</span></td><td><code>/api/species.php</code></td><td>All species. Optional <code>?q=</code>, <code>?category=</code>, <code>?municipality=</code></td></tr>
          <tr><td><span class="method">GET</span></td><td><code>/api/species.php?id={slug}</code></td><td>One species with its photos and videos</td></tr>
          <tr><td><span class="method">GET</span></td><td><code>/api/categories.php</code></td><td>Plant groups</td></tr>
          <tr><td><span class="method">GET</span></td><td><code>/api/municipalities.php</code></td><td>Municipalities of Siargao</td></tr>
        </tbody>
      </table>
    </div>
    <p class="muted small" id="apiStatus"></p>
  </div>
</section>

<?php include 'includes/footer.php'; ?>

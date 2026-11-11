<?php
  $pageTitle  = 'About — Lunhaw';
  $activePage = 'about';
  $navLight   = true;
  include 'includes/header.php';
?>

<section class="page-header">
  <div class="container">
    <nav class="crumbs" aria-label="Breadcrumb"><a href="index.php">Home</a><span>/</span><span>About</span></nav>
    <h1 class="page-title">A living record of what grows on Siargao</h1>
  </div>
</section>

<section class="section section--flush">
  <div class="container about-grid">
    <div class="about-art" id="aboutArt" aria-hidden="true"></div>
    <div class="prose">
      <p class="lead">Lunhaw is a web-based information system documenting the flowers and plants of
        Siargao Island, Surigao del Norte — developed as our final project for <strong>System Integration and Architecture</strong>.</p>
      <p>Siargao lies within the Siargao Island Protected Landscapes and Seascapes and is home to one of the
        largest mangrove forests in Mindanao. Beyond the surf breaks are coastal forests, wetlands and village
        gardens full of species many visitors never notice.</p>
      <p>“Lunhaw” means <em>green</em> in Bisaya. The site is completely open — there is no login or account.
        Anyone can browse, search and view photos and videos of the species we have recorded.</p>
      <dl class="about-facts">
        <div><dt>Location</dt><dd>Siargao Island</dd></div>
        <div><dt>Coverage</dt><dd>9 municipalities</dd></div>
        <div><dt>Access</dt><dd>Free &amp; open</dd></div>
      </dl>
    </div>
  </div>
</section>

<section class="section section--alt" id="method">
  <div class="container">
    <div class="section__head">
      <div>
        <span class="kicker">Methodology</span>
        <h2 class="h2">From the field to your screen</h2>
      </div>
    </div>
    <div class="steps">
      <div class="step"><span class="step__n">01</span><h3>Field visits</h3><p>We visit barangays, shorelines and mangrove areas across the island’s municipalities.</p></div>
      <div class="step"><span class="step__n">02</span><h3>Capture</h3><p>Each plant is photographed and filmed, with location, habitat and blooming period noted.</p></div>
      <div class="step"><span class="step__n">03</span><h3>Identify</h3><p>Local names come from residents; scientific names are checked against references.</p></div>
      <div class="step"><span class="step__n">04</span><h3>Publish</h3><p>Records are stored in MySQL and served through our PHP REST API to this website.</p></div>
    </div>
  </div>
</section>

<section class="section" id="api">
  <div class="container">
    <div class="section__head">
      <div>
        <span class="kicker">System integration</span>
        <h2 class="h2">The Lunhaw REST API</h2>
      </div>
      <p class="section__note">The website never queries the database directly — it consumes our own REST API, which returns JSON.</p>
    </div>

    <div class="arch">
      <div class="arch__node"><span>Client</span><b>Website</b><small>HTML · CSS · JavaScript</small></div>
      <div class="arch__arrow"><span>HTTP GET</span><i></i><span>JSON</span></div>
      <div class="arch__node arch__node--accent"><span>Server</span><b>REST API</b><small>PHP</small></div>
      <div class="arch__arrow"><span>SQL query</span><i></i><span>Rows</span></div>
      <div class="arch__node"><span>Storage</span><b>Database</b><small>MySQL</small></div>
    </div>

    <div class="table-wrap">
      <table class="api-table">
        <thead><tr><th>Method</th><th>Endpoint</th><th>Description</th></tr></thead>
        <tbody>
          <tr><td><span class="method">GET</span></td><td><code>/api/species.php</code></td><td>List all species. Optional <code>q</code>, <code>category</code>, <code>municipality</code></td></tr>
          <tr><td><span class="method">GET</span></td><td><code>/api/species.php?id={slug}</code></td><td>A single species with its photos and videos</td></tr>
          <tr><td><span class="method">GET</span></td><td><code>/api/categories.php</code></td><td>List of plant groups</td></tr>
          <tr><td><span class="method">GET</span></td><td><code>/api/municipalities.php</code></td><td>List of municipalities</td></tr>
        </tbody>
      </table>
    </div>
    <p class="api-status" id="apiStatus"></p>
  </div>
</section>

<?php include 'includes/footer.php'; ?>

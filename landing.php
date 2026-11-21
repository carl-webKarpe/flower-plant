<?php
  /**
   * Landing page — an editorial "field journal" introduction to Siargao Flora.
   * Photos, counts and plant details are loaded live from the REST API (assets/js/landing.js).
   */
  $pageTitle    = 'Siargao Flora — A field guide to the plants of Siargao Island';
  $activePage   = 'landing';
  $navLight     = true;
  $extraStyles  = ['assets/css/landing.css'];
  $extraScripts = ['assets/js/landing.js'];
  include 'includes/header.php';
?>

<!-- HERO -->
<section class="lp-hero">
  <div class="container lp-hero__grid">
    <div class="lp-hero__copy">
      <span class="lp-eyebrow"><span class="lp-dot"></span> Field guide · Siargao Island, Surigao del Norte</span>
      <h1 class="lp-title">Every plant<br>has a <em>story.</em><br><span class="lp-title__count" id="lpCount">—</span> are here.</h1>
      <p class="lp-lead">We walked the farms, gardens and roadsides of Siargao and recorded the plants we found —
        with field photos, local names, uses and where each one grows. Free to explore, no account needed.</p>
      <div class="lp-actions">
        <a href="explore.php" class="btn btn--dark">Explore the plants <span aria-hidden="true">→</span></a>
        <a href="gallery.php" class="btn btn--outline">See field photos</a>
      </div>
      <dl class="lp-stats" id="lpStats">
        <div><dt data-k="species">0</dt><dd>plants recorded</dd></div>
        <div><dt data-k="towns">0</dt><dd>towns visited</dd></div>
        <div><dt data-k="groups">0</dt><dd>plant groups</dd></div>
        <div><dt data-k="videos">0</dt><dd>field videos</dd></div>
      </dl>
    </div>

    <!-- three columns of real field photos drifting slowly -->
    <div class="lp-wall" aria-hidden="true">
      <div class="lp-col" id="lpCol1"></div>
      <div class="lp-col lp-col--down" id="lpCol2"></div>
      <div class="lp-col" id="lpCol3"></div>
    </div>
  </div>
</section>

<!-- GROUPS -->
<section class="lp-section">
  <div class="container">
    <div class="lp-head">
      <span class="lp-kicker">What you’ll find</span>
      <h2 class="h2">From kitchen gardens to coconut groves</h2>
    </div>
    <div class="lp-groups" id="lpGroups"></div>
  </div>
</section>

<!-- SPOTLIGHT -->
<section class="lp-section lp-section--cream">
  <div class="container lp-spot" id="lpSpot">
    <figure class="lp-spot__photo"><img id="lpSpotImg" alt=""><figcaption id="lpSpotCap"></figcaption></figure>
    <div class="lp-spot__info">
      <span class="lp-kicker">Plant spotlight</span>
      <h2 class="lp-spot__name" id="lpSpotName">—</h2>
      <p class="lp-spot__sci" id="lpSpotSci"></p>
      <p class="lp-spot__desc" id="lpSpotDesc"></p>
      <dl class="lp-spot__facts" id="lpSpotFacts"></dl>
      <div class="lp-spot__nav">
        <a class="btn btn--dark btn--sm" id="lpSpotLink" href="explore.php">Full details →</a>
        <button type="button" class="lp-round" id="lpPrev" aria-label="Previous plant">←</button>
        <button type="button" class="lp-round" id="lpNext" aria-label="Next plant">→</button>
        <span class="lp-spot__count" id="lpSpotCount"></span>
      </div>
    </div>
  </div>
</section>

<!-- PLACES -->
<section class="lp-section">
  <div class="container lp-places">
    <div>
      <span class="lp-kicker">Where we gathered</span>
      <h2 class="h2">Recorded across the island</h2>
      <p class="lp-muted">Each plant is linked to the municipality where our group found it. Pick a town to see its plants.</p>
    </div>
    <ol class="lp-towns" id="lpTowns"></ol>
  </div>
</section>

<!-- HOW IT WORKS -->
<section class="lp-section lp-section--dark">
  <div class="container">
    <div class="lp-head lp-head--light">
      <span class="lp-kicker lp-kicker--light">How it works</span>
      <h2 class="h2">From the field to your screen</h2>
    </div>
    <ol class="lp-flow">
      <li><span>01</span><h3>Field visits</h3><p>Our group photographs each plant and notes its name, habitat and location.</p></li>
      <li><span>02</span><h3>MySQL database</h3><p>Records are organized in six related tables in <code>siargao_flora</code>.</p></li>
      <li><span>03</span><h3>REST API</h3><p>A PHP API serves the data as JSON with GET, POST, PUT and DELETE.</p></li>
      <li><span>04</span><h3>This website</h3><p>Every page reads from the API — and so can any other app.</p></li>
    </ol>
  </div>
</section>

<!-- CTA -->
<section class="lp-section">
  <div class="container">
    <div class="lp-cta">
      <div class="lp-cta__mosaic" id="lpMosaic" aria-hidden="true"></div>
      <div class="lp-cta__text">
        <h2 class="h2">Start exploring Siargao’s plants</h2>
        <p>Search by local or scientific name, filter by group or town, and open any plant for its photo and story.</p>
        <div class="lp-actions">
          <a href="explore.php" class="btn btn--accent">Browse all plants <span aria-hidden="true">→</span></a>
          <a href="about.php#api" class="btn btn--ghost">For developers: the API</a>
        </div>
      </div>
    </div>
  </div>
</section>

<?php include 'includes/footer.php'; ?>

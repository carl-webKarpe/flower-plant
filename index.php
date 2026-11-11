<?php
  $pageTitle  = 'Lunhaw — Flora of Siargao Island';
  $activePage = 'home';
  include 'includes/header.php';
?>

<!-- HERO -->
<section class="hero">
  <div class="hero__bg" aria-hidden="true"></div>
  <div class="hero__shade" aria-hidden="true"></div>

  <div class="container hero__content">
    <p class="eyebrow eyebrow--light"><span class="dot"></span> Siargao Island · Surigao del Norte</p>
    <h1 class="hero__title">
      The quiet <em>bloom</em><br>
      behind the waves.
    </h1>

    <div class="hero__row">
      <p class="hero__lead">
        Siargao is known for its surf — but its mangroves, coastal forests and village gardens hold
        a living collection of flowers and plants. Explore them here, freely, with photos and field videos.
      </p>
      <div class="hero__cta">
        <a href="explore.php" class="btn btn--light">Explore species <span class="btn__icon">↗</span></a>
        <a href="gallery.php" class="btn btn--ghost">Watch field videos</a>
      </div>
    </div>
  </div>

  <!-- Floating specimen card (rotates through featured species) -->
  <aside class="specimen" id="heroSpecimen" aria-live="polite">
    <div class="specimen__media" id="heroSpecimenMedia"></div>
    <div class="specimen__body">
      <span class="specimen__tag" id="heroSpecimenTag">Specimen</span>
      <h3 id="heroSpecimenName">—</h3>
      <p class="specimen__sci" id="heroSpecimenSci">—</p>
      <div class="specimen__progress"><span id="heroSpecimenBar"></span></div>
    </div>
  </aside>

  <div class="hero__strip">
    <div class="container hero__strip-inner">
      <span>9.8482° N, 126.0458° E</span>
      <span class="hide-sm">9 municipalities · 1 island group</span>
      <a href="#intro" class="scroll-cue">Scroll <span>↓</span></a>
    </div>
  </div>
</section>

<!-- INTRO STATEMENT -->
<section class="section intro" id="intro">
  <div class="container narrow center">
    <p class="eyebrow"><span class="dot"></span> Why we document</p>
    <p class="statement reveal" id="statement">
      We walk the island’s
      <span class="pill-img" data-slug="bakhaw"></span>
      mangroves, shorelines and backyards to record every
      <span class="pill-img" data-slug="gumamela"></span>
      flower and plant we find — <span class="soft">so locals, students and visitors can learn
      what grows here, and why it is worth protecting.</span>
    </p>
  </div>
</section>

<!-- STATS -->
<section class="stats container" id="stats">
  <div class="stat"><strong data-stat="species">0</strong><span>Species recorded</span></div>
  <div class="stat"><strong data-stat="municipalities">0</strong><span>Municipalities covered</span></div>
  <div class="stat"><strong data-stat="categories">0</strong><span>Plant groups</span></div>
  <div class="stat"><strong data-stat="endemic">0</strong><span>Native to the Philippines</span></div>
</section>

<!-- SPECIMEN INDEX -->
<section class="section">
  <div class="container">
    <div class="section__head">
      <div>
        <p class="eyebrow"><span class="dot"></span> Specimen index</p>
        <h2 class="h2">Featured on the island</h2>
      </div>
      <a href="explore.php" class="link-arrow">View all species →</a>
    </div>

    <ol class="index-list" id="indexList"></ol>
    <div class="index-preview" id="indexPreview" aria-hidden="true"></div>
  </div>
</section>

<!-- CATEGORIES -->
<section class="section section--tint">
  <div class="container">
    <div class="section__head">
      <div>
        <p class="eyebrow"><span class="dot"></span> Plant groups</p>
        <h2 class="h2">Browse by what you see</h2>
      </div>
      <p class="muted section__note">From hibiscus by the road to mangroves in Del Carmen — pick a group to start.</p>
    </div>
    <div class="cat-grid" id="categoryGrid"></div>
  </div>
</section>

<!-- FIELD GALLERY (horizontal) -->
<section class="section">
  <div class="container">
    <div class="section__head">
      <div>
        <p class="eyebrow"><span class="dot"></span> From the field</p>
        <h2 class="h2">Recent captures</h2>
      </div>
      <div class="scroller-ctrl">
        <button class="round-btn" data-scroll="-1" aria-label="Scroll left">←</button>
        <button class="round-btn" data-scroll="1" aria-label="Scroll right">→</button>
      </div>
    </div>
  </div>
  <div class="h-scroll" id="fieldScroller"></div>
</section>

<!-- VIDEO -->
<section class="section video-section">
  <div class="container video-grid">
    <div>
      <p class="eyebrow eyebrow--light"><span class="dot"></span> Field footage</p>
      <h2 class="h2 light">See them where<br>they <em>actually</em> grow.</h2>
      <p class="muted-light">Short clips recorded during our data gathering — mangrove boardwalks, coastal vines,
        and the gardens of General Luna and Dapa.</p>
      <ul class="video-list" id="videoList"></ul>
    </div>
    <div class="video-player" id="videoPlayer"></div>
  </div>
</section>

<!-- MUNICIPALITIES -->
<section class="section">
  <div class="container">
    <div class="section__head">
      <div>
        <p class="eyebrow"><span class="dot"></span> Where we gathered</p>
        <h2 class="h2">Across nine municipalities</h2>
      </div>
      <p class="muted section__note">Each place holds a different mix — tap a town to see what was recorded there.</p>
    </div>
    <div class="muni-grid" id="muniGrid"></div>
  </div>
</section>

<!-- CTA -->
<section class="section">
  <div class="container">
    <div class="cta">
      <div class="cta__art" id="ctaArt" aria-hidden="true"></div>
      <div class="cta__text">
        <h2 class="h2 light">Open to everyone.<br>No sign-up, ever.</h2>
        <p class="muted-light">Lunhaw is free to browse. Our data is served through an open REST API so other
          apps and researchers can build on it too.</p>
        <div class="hero__cta">
          <a href="explore.php" class="btn btn--lime">Start exploring <span class="btn__icon">↗</span></a>
          <a href="about.php#api" class="btn btn--ghost">About the API</a>
        </div>
      </div>
    </div>
  </div>
</section>

<?php include 'includes/footer.php'; ?>

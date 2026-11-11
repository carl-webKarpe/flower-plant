<?php
  $pageTitle  = 'Lunhaw — Flora of Siargao Island';
  $activePage = 'home';
  include 'includes/header.php';
?>

<!-- HERO -->
<section class="hero">
  <div class="hero__bg" aria-hidden="true"></div>
  <div class="hero__overlay" aria-hidden="true"></div>

  <div class="container hero__inner">
    <div class="hero__copy">
      <span class="kicker kicker--glass"><span class="pulse"></span> Siargao Island · Surigao del Norte</span>
      <h1 class="hero__title">Discover the living flora of <span class="hl">Siargao Island</span></h1>
      <p class="hero__lead">An open field guide to the flowers, trees, palms and mangroves found across the island’s
        nine municipalities — documented with photos and field videos.</p>

      <form class="hero-search" action="explore.php" method="get" role="search">
        <div class="hero-search__field">
          <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>
          <input type="search" name="q" placeholder="Search by local or scientific name" aria-label="Search species">
        </div>
        <div class="hero-search__select">
          <select name="category" id="heroCategory" aria-label="Plant group"><option value="">All groups</option></select>
        </div>
        <button class="btn btn--accent" type="submit">Search</button>
      </form>

      <div class="hero__popular">
        <span>Popular:</span>
        <a href="species.php?id=gumamela">Gumamela</a>
        <a href="species.php?id=bakhaw">Bakhaw</a>
        <a href="species.php?id=waling-waling">Waling-waling</a>
        <a href="species.php?id=nipa">Nipa</a>
      </div>
    </div>

    <aside class="specimen" id="heroSpecimen" aria-live="polite">
      <div class="specimen__media" id="heroSpecimenMedia"></div>
      <div class="specimen__body">
        <div>
          <span class="specimen__tag" id="heroSpecimenTag">Featured</span>
          <h3 id="heroSpecimenName">—</h3>
          <p id="heroSpecimenSci">—</p>
        </div>
        <span class="specimen__go" aria-hidden="true">↗</span>
      </div>
      <div class="specimen__progress"><span id="heroSpecimenBar"></span></div>
    </aside>
  </div>

  <div class="container">
    <div class="hero__stats" id="stats">
      <div><strong data-stat="species">0</strong><span>Species documented</span></div>
      <div><strong data-stat="municipalities">0</strong><span>Municipalities surveyed</span></div>
      <div><strong data-stat="categories">0</strong><span>Plant groups</span></div>
      <div><strong data-stat="videos">0</strong><span>Field videos</span></div>
    </div>
  </div>
</section>

<!-- INTRO / VALUE -->
<section class="section">
  <div class="container intro">
    <div class="intro__head reveal">
      <span class="kicker">Why Lunhaw</span>
      <h2 class="h2">A field guide built from the ground up — literally.</h2>
    </div>
    <div class="intro__body reveal">
      <p class="lead">Siargao is famous for its waves, but behind the shoreline are mangrove forests, coastal woodlands
        and village gardens full of species most visitors never notice. We record them first-hand so students,
        locals and travellers can learn what grows here and why it matters.</p>
      <div class="features">
        <div class="feature">
          <span class="feature__icon"><svg viewBox="0 0 24 24"><path d="M12 21s-7-6.2-7-11.5A7 7 0 0 1 19 9.5C19 14.8 12 21 12 21z"/><circle cx="12" cy="9.5" r="2.5"/></svg></span>
          <h3>Gathered on site</h3>
          <p>Every record comes from field visits across the island’s municipalities.</p>
        </div>
        <div class="feature">
          <span class="feature__icon"><svg viewBox="0 0 24 24"><rect x="3" y="5" width="18" height="14" rx="3"/><path d="m10 9 5 3-5 3z"/></svg></span>
          <h3>Photos &amp; video</h3>
          <p>See each species as it actually looks in its natural habitat.</p>
        </div>
        <div class="feature">
          <span class="feature__icon"><svg viewBox="0 0 24 24"><path d="m8 8-4 4 4 4M16 8l4 4-4 4M14 5l-4 14"/></svg></span>
          <h3>Open REST API</h3>
          <p>Data is served as JSON so other apps and researchers can build on it.</p>
        </div>
      </div>
    </div>
  </div>
</section>

<!-- FEATURED SPECIES -->
<section class="section section--alt">
  <div class="container">
    <div class="section__head">
      <div>
        <span class="kicker">Featured species</span>
        <h2 class="h2">Commonly found on the island</h2>
      </div>
      <a href="explore.php" class="btn btn--outline">View all species <span aria-hidden="true">→</span></a>
    </div>
    <div class="tabs" id="featuredTabs" role="tablist"></div>
    <div class="card-grid card-grid--4" id="featuredGrid"></div>
  </div>
</section>

<!-- PLANT GROUPS -->
<section class="section">
  <div class="container">
    <div class="section__head">
      <div>
        <span class="kicker">Plant groups</span>
        <h2 class="h2">Browse by group</h2>
      </div>
      <p class="section__note">From hibiscus hedges along the road to the tidal forests of Del Carmen.</p>
    </div>
    <div class="bento" id="categoryGrid"></div>
  </div>
</section>

<!-- VIDEO -->
<section class="section section--dark">
  <div class="container">
    <div class="section__head section__head--light">
      <div>
        <span class="kicker kicker--light">Field footage</span>
        <h2 class="h2">See them where they grow</h2>
      </div>
      <a href="gallery.php?type=video" class="btn btn--ghost">All videos <span aria-hidden="true">→</span></a>
    </div>
    <div class="video-layout">
      <div class="video-player" id="videoPlayer"></div>
      <ul class="video-list" id="videoList"></ul>
    </div>
  </div>
</section>

<!-- MUNICIPALITIES -->
<section class="section">
  <div class="container muni-layout">
    <div class="muni-intro reveal">
      <span class="kicker">Coverage</span>
      <h2 class="h2">Recorded across nine municipalities</h2>
      <p class="muted">Each town holds a different mix of species — from coastal vines in Santa Monica to the
        mangrove forest of Del Carmen. Select a municipality to see its records.</p>
      <a href="explore.php" class="btn btn--dark">Explore by location <span aria-hidden="true">→</span></a>
    </div>
    <div class="muni-list" id="muniGrid"></div>
  </div>
</section>

<!-- CTA -->
<section class="section section--tight-top">
  <div class="container">
    <div class="cta reveal">
      <div class="cta__text">
        <span class="kicker kicker--light">Open access</span>
        <h2 class="h2">Free for everyone. No sign-up required.</h2>
        <p>Browse every record, photo and video at no cost. Developers can use the same data through our REST API.</p>
      </div>
      <div class="cta__actions">
        <a href="explore.php" class="btn btn--accent">Start exploring <span aria-hidden="true">→</span></a>
        <a href="about.php#api" class="btn btn--ghost">API documentation</a>
      </div>
    </div>
  </div>
</section>

<?php include 'includes/footer.php'; ?>

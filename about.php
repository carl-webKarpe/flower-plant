<?php
  $pageTitle  = 'About — Siargao Flora';
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
      <p class="lead">Siargao Flora is a web-based information system documenting the flowers and plants of
        Siargao Island, Surigao del Norte — developed as our final project for <strong>System Integration and Architecture</strong>.</p>
      <p>Siargao lies within the Siargao Island Protected Landscapes and Seascapes and is home to one of the
        largest mangrove forests in Mindanao. Beyond the surf breaks are coastal forests, wetlands and village
        gardens full of species many visitors never notice.</p>
      <p>The site is completely open — there is no login or account.
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
        <h2 class="h2">The Siargao Flora REST API</h2>
      </div>
      <p class="section__note">The website never queries the database directly — it consumes our own REST API, which returns JSON.</p>
    </div>

    <div class="arch">
      <div class="arch__node"><span>Clients</span><b>Website &amp; apps</b><small>HTML · JS · PHP · Python</small></div>
      <div class="arch__arrow"><span>GET · POST · PUT · DELETE</span><i></i><span>JSON</span></div>
      <div class="arch__node arch__node--accent"><span>Server</span><b>REST API</b><small>PHP</small></div>
      <div class="arch__arrow"><span>SQL query</span><i></i><span>Rows</span></div>
      <div class="arch__node"><span>Storage</span><b>Database</b><small>MySQL</small></div>
    </div>

    <div class="table-wrap">
      <table class="api-table">
        <thead><tr><th>Method</th><th>Endpoint</th><th>Description</th><th>Responses</th></tr></thead>
        <tbody>
          <tr><td><span class="m-badge m-get">GET</span></td><td><code>/api/</code></td><td>Health check — confirms the API can reach the database</td><td>200</td></tr>
          <tr><td><span class="m-badge m-get">GET</span></td><td><code>/api/species.php</code></td><td>List species. Optional <code>q</code>, <code>category</code>, <code>municipality</code></td><td>200</td></tr>
          <tr><td><span class="m-badge m-get">GET</span></td><td><code>/api/species.php?id={slug}</code></td><td>One species with its towns, photos and videos</td><td>200 · 404</td></tr>
          <tr><td><span class="m-badge m-post">POST</span></td><td><code>/api/species.php</code></td><td>Create a species (JSON body, <code>X-API-Key</code> header)</td><td>201 · 401 · 409 · 422</td></tr>
          <tr><td><span class="m-badge m-put">PUT</span></td><td><code>/api/species.php?id={slug}</code></td><td>Update a species — only the fields you send</td><td>200 · 401 · 404 · 422</td></tr>
          <tr><td><span class="m-badge m-delete">DELETE</span></td><td><code>/api/species.php?id={slug}</code></td><td>Delete a species and its photo/video records</td><td>200 · 401 · 404</td></tr>
          <tr><td><span class="m-badge m-get">GET</span></td><td><code>/api/categories.php</code></td><td>Plant groups with species counts</td><td>200</td></tr>
          <tr><td><span class="m-badge m-get">GET</span></td><td><code>/api/municipalities.php</code></td><td>Municipalities of Siargao</td><td>200</td></tr>
          <tr><td><span class="m-badge m-get">GET</span></td><td><code>/api/videos.php</code></td><td>All videos, including general field footage. Optional <code>species</code></td><td>200</td></tr>
        </tbody>
      </table>
    </div>
    <p class="api-status" id="apiStatus"></p>
  </div>
</section>

<!-- LIVE API TESTER -->
<section class="section section--alt" id="try">
  <div class="container">
    <div class="section__head">
      <div>
        <span class="kicker">JSON exchange</span>
        <h2 class="h2">Try the API live</h2>
      </div>
      <p class="section__note">Send a real request to our API and see the JSON it returns. To add, edit or delete, use the
        <a class="link-btn" href="manage.php">Manage data</a> page.</p>
    </div>
    <div class="tester">
      <div class="tester__presets" id="testerPresets">
        <button type="button" data-url="api/species.php">All species</button>
        <button type="button" data-url="api/species.php?id=gumamela">One species</button>
        <button type="button" data-url="api/species.php?q=hibiscus">Search</button>
        <button type="button" data-url="api/species.php?category=Ornamental">By group</button>
        <button type="button" data-url="api/species.php?municipality=Dapa">By town</button>
        <button type="button" data-url="api/categories.php">Categories</button>
        <button type="button" data-url="api/municipalities.php">Municipalities</button>
        <button type="button" data-url="api/videos.php">Videos</button>
        <button type="button" data-url="api/species.php?id=not-a-plant">404 error</button>
      </div>
      <form class="tester__bar" id="testerForm">
        <span class="m-badge m-get">GET</span>
        <input type="text" id="testerUrl" value="api/species.php?id=gumamela" aria-label="Request URL" spellcheck="false">
        <button class="btn btn--accent btn--sm" type="submit">Send</button>
      </form>
      <div class="tester__meta" id="testerMeta">Press Send to make a request.</div>
      <pre class="json-out tester__out" id="testerOut"></pre>
    </div>
  </div>
</section>

<!-- DATABASE STRUCTURE -->
<section class="section" id="database">
  <div class="container">
    <div class="section__head">
      <div>
        <span class="kicker">Relational database</span>
        <h2 class="h2">How the data is organized</h2>
      </div>
      <p class="section__note">Six related MySQL tables. Each fact is stored once and linked with foreign keys, so a town or
        plant group is never duplicated.</p>
    </div>
    <div class="erd">
      <div class="erd__table erd__table--main">
        <h3>species</h3>
        <ul>
          <li class="pk">id</li><li>slug <em>unique</em></li><li>local_name</li><li>common_name</li><li>scientific_name</li><li>family</li>
          <li class="fk">category_id → categories</li><li>color</li><li>is_native</li><li>status</li><li>habitat</li><li>blooming</li>
          <li>uses</li><li>description</li><li>date_added</li>
        </ul>
      </div>
      <div class="erd__col">
        <div class="erd__table"><h3>categories</h3><ul><li class="pk">id</li><li>name <em>unique</em></li><li>blurb</li></ul>
          <p class="erd__rel">1 category → many species</p></div>
        <div class="erd__table"><h3>municipalities</h3><ul><li class="pk">id</li><li>name <em>unique</em></li></ul>
          <p class="erd__rel">many ↔ many species</p></div>
      </div>
      <div class="erd__col">
        <div class="erd__table erd__table--link"><h3>species_municipalities</h3><ul><li class="pk fk">species_id → species</li><li class="pk fk">municipality_id → municipalities</li></ul>
          <p class="erd__rel">Link table: where each species was recorded</p></div>
        <div class="erd__table"><h3>species_photos</h3><ul><li class="pk">id</li><li class="fk">species_id → species</li><li>src</li><li>caption</li><li>sort_order</li></ul>
          <p class="erd__rel">1 species → many photos</p></div>
        <div class="erd__table"><h3>species_videos</h3><ul><li class="pk">id</li><li class="fk">species_id → species <em>nullable</em></li><li>src</li><li>title</li><li>description</li><li>poster</li><li>sort_order</li></ul>
          <p class="erd__rel">1 species → many videos (or general footage)</p></div>
      </div>
    </div>
    <p class="erd__legend"><span class="pk">PK</span> primary key <span class="fk">FK</span> foreign key — deleting a species also removes its links, photos and videos (<code>ON DELETE CASCADE</code>).</p>
  </div>
</section>

<!-- TESTING + REUSE -->
<section class="section section--alt" id="testing">
  <div class="container reuse-grid">
    <div class="reuse-card">
      <span class="kicker">Testing</span>
      <h2 class="h3">Validated with Postman</h2>
      <p>Our Postman collection sends 23 requests — every endpoint, a full create → read → update → delete cycle, and
        error cases (401, 404, 405, 409, 422) — with automatic tests on each response.</p>
      <ol class="steps-list">
        <li>Import <code>postman/Siargao-Flora.postman_collection.json</code> and the environment file.</li>
        <li>Select the <b>Siargao Flora - Local</b> environment and check <code>baseUrl</code> and <code>apiKey</code>.</li>
        <li>Click <b>Run collection</b>. All tests should pass.</li>
      </ol>
      <div class="reuse-actions">
        <a class="btn btn--dark btn--sm" href="postman/Siargao-Flora.postman_collection.json" download>Download collection</a>
        <a class="btn btn--outline btn--sm" href="postman/Siargao-Flora-Local.postman_environment.json" download>Environment</a>
      </div>
    </div>
    <div class="reuse-card" id="reuse">
      <span class="kicker">Reusability</span>
      <h2 class="h3">One API, many applications</h2>
      <p>Because the API speaks plain JSON over HTTP, any program can use it. Three separate apps reuse it without sharing any code with this website:</p>
      <ul class="reuse-list">
        <li><b>Plant of the Day widget</b><span>HTML + JavaScript, embeddable on any website</span></li>
        <li><b>Flora Report</b><span>Server-side PHP statistics page</span></li>
        <li><b>Command-line client</b><span>Python script</span></li>
      </ul>
      <div class="reuse-actions">
        <a class="btn btn--dark btn--sm" href="examples/">Open the demos →</a>
      </div>
    </div>
  </div>
</section>

<?php include 'includes/footer.php'; ?>

<?php
  /**
   * Manage data — adds, edits and deletes species through the REST API
   * (POST / PUT / DELETE), and shows every request and JSON response in a live log.
   * Writing requires the API key from api/config.php (or api/config.local.php).
   */
  $pageTitle    = 'Manage data — Siargao Flora';
  $activePage   = 'manage';
  $navLight     = true;
  $extraScripts = ['assets/js/manage.js'];
  include 'includes/header.php';
?>

<section class="page-header">
  <div class="container page-header__row">
    <div>
      <nav class="crumbs" aria-label="Breadcrumb"><a href="index.php">Home</a><span>/</span><span>Manage data</span></nav>
      <h1 class="page-title">Manage data</h1>
      <p class="page-lead">Add, edit and delete species. Every change is sent to our REST API as JSON using
        <b>POST</b>, <b>PUT</b> and <b>DELETE</b> — watch the requests in the API log below.</p>
    </div>
    <div class="method-legend" aria-hidden="true">
      <span class="m-badge m-get">GET</span><span class="m-badge m-post">POST</span>
      <span class="m-badge m-put">PUT</span><span class="m-badge m-delete">DELETE</span>
    </div>
  </div>
</section>

<section class="section section--flush">
  <div class="container">

    <!-- API key -->
    <div class="keybar">
      <div class="keybar__icon"><svg viewBox="0 0 24 24"><circle cx="8" cy="15" r="4"/><path d="m11 12 9-9M17 6l3 3M14 9l2 2"/></svg></div>
      <div class="keybar__text">
        <b>API key</b>
        <span>Reading is public. Adding, editing and deleting need the <code>api_key</code> from <code>api/config.local.php</code>.</span>
      </div>
      <form class="keybar__form" id="keyForm" autocomplete="off">
        <input type="password" id="apiKey" placeholder="Enter API key" aria-label="API key">
        <button class="btn btn--dark btn--sm" type="submit">Use key</button>
      </form>
      <span class="keybar__status" id="keyStatus"></span>
    </div>

    <div class="manage">
      <!-- Species list -->
      <div class="panel manage__list">
        <div class="manage__head">
          <h2>Species <span class="count-pill" id="speciesCount">0</span></h2>
          <div class="manage__tools">
            <div class="input-icon input-icon--sm">
              <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>
              <input type="search" id="listSearch" placeholder="Filter list" aria-label="Filter species list">
            </div>
            <button class="btn btn--accent btn--sm" type="button" id="newBtn">+ Add species</button>
          </div>
        </div>
        <div class="table-wrap table-wrap--flat">
          <table class="data-table">
            <thead><tr><th>Species</th><th>Group</th><th>Towns</th><th class="ta-r">Actions</th></tr></thead>
            <tbody id="speciesRows"><tr><td colspan="4" class="muted">Loading…</td></tr></tbody>
          </table>
        </div>
      </div>

      <!-- Add / edit form -->
      <form class="panel manage__form" id="speciesForm" novalidate>
        <div class="manage__head">
          <h2 id="formTitle">Add a species</h2>
          <span class="m-badge m-post" id="formMethod">POST</span>
        </div>

        <div class="form-grid">
          <label class="field"><span>Local name *</span><input name="local_name" required placeholder="e.g. Gumamela"></label>
          <label class="field"><span>Scientific name *</span><input name="scientific_name" required placeholder="e.g. Hibiscus rosa-sinensis"></label>
          <label class="field"><span>Common name</span><input name="common_name" placeholder="e.g. Chinese hibiscus"></label>
          <label class="field"><span>Family</span><input name="family" placeholder="e.g. Malvaceae"></label>
          <label class="field"><span>Plant group *</span><select name="category" id="categorySelect" required></select></label>
          <label class="field"><span>Status</span><input name="status" placeholder="Native, Cultivated, Endangered…"></label>
          <label class="field"><span>Habitat</span><input name="habitat" placeholder="Where it grows"></label>
          <label class="field"><span>Blooming</span><input name="blooming" placeholder="e.g. April–June"></label>
          <div class="field field--row">
            <label class="switch"><input type="checkbox" name="native"><i></i><span>Native to the Philippines</span></label>
            <label class="color-field"><span>Colour</span><input type="color" name="color" value="#5b8a4a"></label>
          </div>
          <label class="field field--full"><span>Description</span><textarea name="description" rows="3"></textarea></label>
          <label class="field field--full"><span>Uses &amp; significance</span><textarea name="uses" rows="2"></textarea></label>

          <fieldset class="field field--full">
            <legend>Recorded in (municipalities)</legend>
            <div class="check-grid" id="muniChecks"></div>
          </fieldset>

          <label class="field field--full"><span>Photos <small>— one per line: <code>file-name.jpg | caption</code> (file goes in assets/images/species/)</small></span>
            <textarea name="photos" rows="2" placeholder="gumamela-1.jpg | Roadside hedge, General Luna"></textarea></label>
          <label class="field field--full"><span>Videos <small>— one per line: <code>file.mp4 or YouTube link | title</code></small></span>
            <textarea name="videos" rows="2" placeholder="https://youtu.be/XXXXXXXXXXX | Mangrove walk"></textarea></label>
        </div>

        <p class="form-error" id="formError" hidden></p>
        <div class="form-actions">
          <button class="btn btn--outline btn--sm" type="button" id="cancelBtn">Clear form</button>
          <button class="btn btn--dark" type="submit" id="saveBtn">Save species</button>
        </div>
      </form>
    </div>

    <!-- API activity log -->
    <div class="panel apilog">
      <div class="manage__head">
        <h2>API log <small class="muted">— every request this page sends, and the JSON that comes back</small></h2>
        <button class="link-btn" type="button" id="clearLog">Clear</button>
      </div>
      <ol class="apilog__list" id="apiLog"></ol>
    </div>
  </div>
</section>

<div class="toast" id="toast" role="status" aria-live="polite"></div>

<?php include 'includes/footer.php'; ?>

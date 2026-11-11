<footer class="footer">
  <div class="container">
    <div class="footer__top">
      <div class="footer__brand">
        <a href="index.php" class="brand brand--footer">
          <span class="brand__mark" aria-hidden="true"><svg viewBox="0 0 32 32"><path d="M16 27c0-8 1-12 7-17-1 8-3 12-7 17z"/><path d="M16 27c0-6-1-10-7-14 0 7 3 11 7 14z" opacity=".6"/></svg></span>
          <span class="brand__text">Siargao <span>Flora</span></span>
        </a>
        <p>An open field guide to the flowers and plants of Siargao Island, Surigao del Norte. Free to use — no account needed.</p>
        <form class="footer__search" action="explore.php" method="get">
          <input type="search" name="q" placeholder="Search a species…" aria-label="Search species">
          <button type="submit" aria-label="Search">→</button>
        </form>
      </div>
      <div class="footer__col">
        <h4>Explore</h4>
        <a href="explore.php">All species</a>
        <a href="explore.php?category=Flower">Flowers</a>
        <a href="explore.php?category=Tree">Trees</a>
        <a href="explore.php?category=Mangrove">Mangroves</a>
      </div>
      <div class="footer__col">
        <h4>Media</h4>
        <a href="gallery.php">Photo gallery</a>
        <a href="gallery.php?type=video">Field videos</a>
      </div>
      <div class="footer__col">
        <h4>Project</h4>
        <a href="about.php">About Siargao Flora</a>
        <a href="about.php#method">Data gathering</a>
        <a href="about.php#api">REST API</a>
      </div>
    </div>
    <div class="footer__bottom">
      <span>© <?= date('Y') ?> Siargao Flora · System Integration &amp; Architecture Final Project</span>
      <span>Siargao Island, Surigao del Norte, Philippines</span>
    </div>
  </div>
</footer>

<script src="assets/js/config.js"></script>
<script src="assets/js/data.js"></script>
<script src="assets/js/api.js"></script>
<script src="assets/js/illustration.js"></script>
<script src="assets/js/app.js"></script>
<script src="assets/js/motion.js"></script>
</body>
</html>

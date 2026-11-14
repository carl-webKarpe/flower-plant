<?php
/**
 * Animated logo intro shown before the website.
 * Lasts about 5 seconds. Plays once per browser session (add ?intro=1 to any URL to force it, e.g. for a presentation).
 * Skipped automatically for visitors who prefer reduced motion.
 */
$introWords = [['Siargao', false], ['Flora', true]];
$letter = 0;
?>
<script>
  (function () {
    var d = document.documentElement, show = true;
    try {
      var force = /[?&]intro=1\b/.test(location.search);
      var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
      show = force || (!sessionStorage.getItem('sf-intro-seen') && !reduce);
      sessionStorage.setItem('sf-intro-seen', '1');
    } catch (e) { /* storage blocked: still show once */ }
    d.classList.add(show ? 'intro-on' : 'intro-off');
  })();
</script>

<div class="splash" id="splash" aria-hidden="true">
  <div class="splash__glow"></div>
  <div class="splash__grid"></div>

  <div class="splash__center">
    <div class="splash__logo">
      <svg class="splash__ring" viewBox="0 0 200 200"><circle cx="100" cy="100" r="92"/></svg>
      <svg class="splash__mark" viewBox="0 0 120 120">
        <rect class="splash__box" x="6" y="6" width="108" height="108" rx="32" pathLength="1"/>
        <g transform="translate(0 2) scale(3.75)">
          <path class="splash__leaf splash__leaf--r" d="M16 27c0-8 1-12 7-17-1 8-3 12-7 17z" pathLength="1"/>
          <path class="splash__leaf splash__leaf--l" d="M16 27c0-6-1-10-7-14 0 7 3 11 7 14z" pathLength="1"/>
        </g>
      </svg>
      <div class="splash__sparks">
        <?php for ($i = 0; $i < 10; $i++): ?><i style="--a:<?= $i * 36 ?>deg;--d:<?= 70 + ($i % 3) * 18 ?>px"></i><?php endfor; ?>
      </div>
    </div>

    <h2 class="splash__word">
      <?php foreach ($introWords as [$word, $accent]): ?>
        <span class="splash__w <?= $accent ? 'is-accent' : '' ?>">
          <?php foreach (preg_split('//u', $word, -1, PREG_SPLIT_NO_EMPTY) as $ch): ?><span style="--i:<?= $letter++ ?>"><?= htmlspecialchars($ch) ?></span><?php endforeach; ?>
        </span>
      <?php endforeach; ?>
    </h2>
    <p class="splash__tag">Flowers &amp; plants of Siargao Island</p>
  </div>

  <div class="splash__foot">
    <span>Surigao del Norte · Philippines</span>
    <div class="splash__bar"><i></i></div>
    <span>9.85° N · 126.05° E</span>
  </div>

</div>

<script>
  (function () {
    var d = document.documentElement, intro = document.getElementById('splash');
    if (!d.classList.contains('intro-on')) { intro.remove(); return; }
    var done = false, start = Date.now(), MIN = 5000, MAX = 8000;
    function finish() {
      if (done) return; done = true;
      intro.classList.add('is-leaving');
      d.classList.add('intro-done');
      setTimeout(function () { intro.remove(); d.classList.remove('intro-on'); }, 1100);
    }
    // wait for the intro to finish playing, and for the page to load (but never longer than MAX)
    window.addEventListener('load', function () { setTimeout(finish, Math.max(0, MIN - (Date.now() - start))); });
    setTimeout(finish, MAX);
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') finish(); });
  })();
</script>

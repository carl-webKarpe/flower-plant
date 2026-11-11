<?php
  // Shared <head> + navigation. Each page sets $pageTitle and $activePage before including.
  $pageTitle  = $pageTitle  ?? 'Lunhaw — Flora of Siargao';
  $activePage = $activePage ?? 'home';
  $navLight   = $navLight   ?? false; // true on pages without a dark hero
  $nav = [
    'home'    => ['Home', 'index.php'],
    'explore' => ['Explore', 'explore.php'],
    'gallery' => ['Gallery', 'gallery.php'],
    'about'   => ['About', 'about.php'],
  ];
?>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title><?= htmlspecialchars($pageTitle) ?></title>
  <meta name="description" content="Lunhaw is a free, open field guide to the flowers and plants of Siargao Island, Surigao del Norte.">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300..700;1,9..144,300..700&family=Manrope:wght@300..800&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="assets/css/style.css">
</head>
<body data-page="<?= htmlspecialchars($activePage) ?>">

<header class="nav <?= $navLight ? 'nav--light' : '' ?>" id="nav">
  <div class="nav__inner">
    <a href="index.php" class="brand" aria-label="Lunhaw home">
      <span class="brand__mark" aria-hidden="true">
        <svg viewBox="0 0 32 32"><path d="M16 29c0-9 0-14 8-21-1 9-3 14-8 21z"/><path d="M16 29c0-7-1-12-8-17 0 8 3 13 8 17z" opacity=".7"/><circle cx="16" cy="7" r="3.2"/></svg>
      </span>
      <span class="brand__text">Lunhaw<small>Flora of Siargao</small></span>
    </a>

    <nav class="nav__links" id="navLinks" aria-label="Primary">
      <?php foreach ($nav as $key => [$label, $href]): ?>
        <a href="<?= $href ?>" class="<?= $activePage === $key ? 'is-active' : '' ?>"><?= $label ?></a>
      <?php endforeach; ?>
    </nav>

    <div class="nav__actions">
      <form class="nav__search" action="explore.php" method="get" role="search">
        <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>
        <input type="search" name="q" placeholder="Search species…" aria-label="Search species">
      </form>
      <button class="nav__toggle" id="navToggle" aria-label="Open menu" aria-expanded="false">
        <span></span><span></span>
      </button>
    </div>
  </div>
</header>

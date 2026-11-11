<?php
  // Shared <head> + navigation. Each page sets $pageTitle, $activePage and optionally $navLight before including.
  $pageTitle  = $pageTitle  ?? 'Siargao Flora';
  $activePage = $activePage ?? 'home';
  $navLight   = $navLight   ?? false; // true on pages without a dark hero
  // Adds ?v=<last modified time> so browsers always load the newest file after an update.
  if (!function_exists('asset')) {
    function asset(string $path): string {
      $file = __DIR__ . '/../' . $path;
      return $path . (is_file($file) ? '?v=' . filemtime($file) : '');
    }
  }
  $nav = [
    'home'    => ['Home', 'index.php'],
    'explore' => ['Species', 'explore.php'],
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
  <meta name="description" content="Siargao Flora is a free, open field guide to the flowers and plants of Siargao Island, Surigao del Norte.">
  <meta name="theme-color" content="#0c1c14">
  <link rel="icon" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E%3Crect width='32' height='32' rx='9' fill='%230c1c14'/%3E%3Cpath d='M16 26c0-8 1-12 7-17-1 8-3 12-7 17z' fill='%23c6f36b'/%3E%3Cpath d='M16 26c0-6-1-10-7-14 0 7 3 11 7 14z' fill='%23c6f36b' opacity='.6'/%3E%3C/svg%3E">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Plus+Jakarta+Sans:wght@500;600;700;800&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="<?= asset('assets/css/style.css') ?>">
</head>
<body data-page="<?= htmlspecialchars($activePage) ?>">

<header class="nav <?= $navLight ? 'nav--light' : '' ?>" id="nav">
  <div class="nav__inner">
    <a href="index.php" class="brand" aria-label="Siargao Flora home">
      <span class="brand__mark" aria-hidden="true">
        <svg viewBox="0 0 32 32"><path d="M16 27c0-8 1-12 7-17-1 8-3 12-7 17z"/><path d="M16 27c0-6-1-10-7-14 0 7 3 11 7 14z" opacity=".6"/></svg>
      </span>
      <span class="brand__text">Siargao <span>Flora</span></span>
    </a>

    <nav class="nav__links" id="navLinks" aria-label="Primary">
      <?php foreach ($nav as $key => [$label, $href]): ?>
        <a href="<?= $href ?>" class="<?= $activePage === $key ? 'is-active' : '' ?>"><?= $label ?></a>
      <?php endforeach; ?>
    </nav>

    <div class="nav__actions">
      <form class="nav__search" action="explore.php" method="get" role="search">
        <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>
        <input type="search" name="q" placeholder="Search species" aria-label="Search species">
        <kbd>/</kbd>
      </form>
      <a href="explore.php" class="btn btn--accent btn--sm nav__cta">Browse flora</a>
      <button class="nav__toggle" id="navToggle" aria-label="Open menu" aria-expanded="false">
        <span></span><span></span>
      </button>
    </div>
  </div>
</header>

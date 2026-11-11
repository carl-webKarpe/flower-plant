# Lunhaw — Flora of Siargao

A free, open field guide to the flowers and plants of Siargao Island, Surigao del Norte.
Final project for **System Integration and Architecture** (PHP + MySQL REST API, consumed by this website).
No login: anyone can browse.

> Status: **front-end only.** Species records in `assets/js/data.js` are *sample data*; field data gathering is ongoing.

## Run locally

```bash
php -S localhost:8000
```

Then open http://localhost:8000 (or drop the folder into XAMPP's `htdocs`).

## Pages

| Page | File |
|---|---|
| Home (hero, featured species, groups, videos, municipalities) | `index.php` |
| Explore / search & filter | `explore.php` |
| Species detail | `species.php?id={slug}` |
| Photos & videos | `gallery.php` |
| About + API documentation | `about.php` |

Shared header/nav and footer are in `includes/`.

## Adding your field photos and videos

Put files in `assets/images/species/` and `assets/videos/` using the file names listed in `data.js`
(e.g. `gumamela-1.jpg`, `bakhaw-boardwalk.mp4`). Until a file exists, the site shows an illustrated placeholder
for that species. A hero photo can be added at `assets/images/hero.jpg`. YouTube links also work as video `src`.

## Connecting the REST API (next phase)

All data access goes through `assets/js/api.js`. When the PHP API is ready, set `USE_API: true` in
`assets/js/config.js`. Expected endpoints (JSON, optionally wrapped as `{ "data": ... }`):

| Method | Endpoint | Returns |
|---|---|---|
| GET | `api/species.php` | list of species (`?q=`, `?category=`, `?municipality=` optional) |
| GET | `api/species.php?id={slug}` | one species |
| GET | `api/categories.php` | `[{ name, blurb }]` |
| GET | `api/municipalities.php` | `["Burgos", "Dapa", ...]` |

Species fields: `id, local_name, common_name, scientific_name, family, category, color, native, status,
municipalities[], habitat, blooming, uses, description, photos[{src, caption}], videos[{src, title}], date_added`.
If the API is unreachable the site falls back to the sample data and logs a warning.

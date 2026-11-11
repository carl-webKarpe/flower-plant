# Siargao Flora

A free, open field guide to the flowers and plants of Siargao Island, Surigao del Norte.
Final project for **System Integration and Architecture**: a MySQL database, a PHP REST API, and a website that
consumes that API. No login: anyone can browse.

```
Website (HTML/CSS/JS)  --HTTP GET-->  REST API (PHP, api/)  --SQL-->  MySQL (database "lunhaw")
                       <---JSON----                         <--rows--
```

## Setup (XAMPP Apache + MySQL Workbench)

This project uses **XAMPP only for Apache**. The database runs on the **MySQL Server you manage in MySQL Workbench**.
(If XAMPP's own MySQL won't start, it's usually because your MySQL Server already uses port 3306 — that's fine,
leave XAMPP's MySQL stopped.)

1. **Copy the project** to `C:\xampp\htdocs\flower-plant`.
2. **Create the database:** open MySQL Workbench → connect to your local instance → *File → Open SQL Script…* →
   choose `database/lunhaw.sql` → click the ⚡ *Execute* button. Refresh the *Schemas* panel; you should see `lunhaw`.
3. **Set your password:** copy `api/config.php` to `api/config.local.php` and enter the same user/password/port you use
   in Workbench. (`config.local.php` is git-ignored, so your password never gets pushed.)
4. **Start Apache** in the XAMPP Control Panel.
5. **Check the API:** open http://localhost/flower-plant/api/ — it should say `"status": "ok"` and `"database": "connected"`.
6. **Open the website:** http://localhost/flower-plant/

If the API can't reach the database, the website still works using the sample data in `assets/js/data.js`,
and the About page shows "In development" instead of "Connected".

## REST API

Reading is public. Adding, editing and deleting require the header `X-API-Key` (value set in your config file).

| Method | Endpoint | Description |
|---|---|---|
| GET | `api/` | Health check |
| GET | `api/species.php` | List species. Optional `q`, `category`, `municipality` |
| GET | `api/species.php?id={slug}` | One species |
| POST | `api/species.php` | Create a species (JSON body) |
| PUT | `api/species.php?id={slug}` | Update a species (JSON body, only the fields you send) |
| DELETE | `api/species.php?id={slug}` | Delete a species |
| GET | `api/categories.php` | Plant groups with species counts |
| GET | `api/municipalities.php` | Municipalities |
| GET | `api/videos.php` | All videos, incl. general field footage (`?species=` optional) |

Example create body (`category` and `municipalities` must match names already in the database):

```json
{
  "local_name": "Gumamela",
  "scientific_name": "Hibiscus rosa-sinensis",
  "category": "Flower",
  "native": false,
  "status": "Cultivated",
  "municipalities": ["Dapa", "General Luna"],
  "photos": [{ "src": "gumamela-2.jpg", "caption": "Dapa plaza" }],
  "videos": [{ "src": "https://youtu.be/XXXXXXXXXXX", "title": "Gumamela hedge" }]
}
```

You can test write requests with Postman or Thunder Client.

## Database tables

`categories`, `municipalities`, `species`, `species_municipalities` (where each species was recorded),
`species_photos`, `species_videos`. See `database/lunhaw.sql`.

## Adding photos and videos

**General field footage** (not tied to one species, e.g. the garden tour): put the file in `assets/videos/` and add a row
to `species_videos` with `species_id = NULL`. An optional `poster` (cover image file name) and `description` are supported:

```sql
INSERT INTO lunhaw.species_videos (species_id, src, title, description, poster)
VALUES (NULL, 'my-clip.mp4', 'Mangrove walk', 'Del Carmen boardwalk', 'my-clip.jpg');
```

If your database was created before this feature, run `database/update-01-general-videos.sql` once in Workbench.

**Species photos and videos:**

Put files in `assets/images/species/` and `assets/videos/`, then add a row to `species_photos` / `species_videos`
with the file name as `src` (or use the API). A full URL or YouTube link also works. Until a photo exists,
the site shows an illustrated placeholder. A hero photo can go at `assets/images/hero.jpg`.

## Pages

`index.php` (home), `explore.php` (species directory), `species.php?id={slug}` (detail),
`gallery.php` (photos & videos), `about.php` (project + API docs). Shared header/footer in `includes/`.

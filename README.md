# Siargao Flora

A free, open field guide to the flowers and plants of Siargao Island, Surigao del Norte.
Final project for **System Integration and Architecture**: a MySQL database, a PHP REST API, and a website that
consumes that API. No login: anyone can browse.

```
Website (HTML/CSS/JS)  --HTTP GET-->  REST API (PHP, api/)  --SQL-->  MySQL (database "siargao_flora")
                       <---JSON----                         <--rows--
```

## Setup (XAMPP Apache + MySQL Workbench)

This project uses **XAMPP only for Apache**. The database runs on the **MySQL Server you manage in MySQL Workbench**.
(If XAMPP's own MySQL won't start, it's usually because your MySQL Server already uses port 3306 — that's fine,
leave XAMPP's MySQL stopped.)

1. **Copy the project** to `C:\xampp\htdocs\flower-plant`.
2. **Create the database:** open MySQL Workbench → connect to your local instance → *File → Open SQL Script…* →
   choose `database/siargao_flora.sql` → click the ⚡ *Execute* button. Refresh the *Schemas* panel; you should see `siargao_flora`.
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

## Database (`siargao_flora`)

**Submission file:** `database/siargao_flora.sql` — the complete structure (6 tables, 5 foreign keys, 1 view) and
all collected records. **ERD and data dictionary:** `docs/ERD-Siargao-Flora.png` and `docs/Siargao-Flora-Database-Design.pdf`.

| Table | Purpose | Key relationships |
|---|---|---|
| `categories` | Plant groups (Vegetable, Herb, Ornamental, Fruit, Palm) | 1 → many `species` |
| `municipalities` | The 9 municipalities of Siargao | many ↔ many `species` (via link table) |
| `species` | One row per plant recorded in the field | FK `category_id` → `categories` |
| `species_municipalities` | Where each species was recorded | PK + FKs → `species`, `municipalities` |
| `species_photos` | Photos of each species | FK `species_id` → `species` |
| `species_videos` | Field videos (`species_id` NULL = general footage) | FK `species_id` → `species` |

View `species_overview` shows one readable row per plant: `SELECT * FROM species_overview;`

## Field data

The database holds 20 plants gathered in Dapa, Del Carmen, Pilar, San Isidro and General Luna
(sources: `docs/PlantsInfo.docx` and `docs/PlantsInfo-2.docx`), grouped as **Vegetable**, **Herb**, **Ornamental**,
**Fruit** and **Palm**, with photos in `assets/images/species/`.

Run `database/siargao_flora.sql` in Workbench to create the database with all of it (20 plants, 20 photos, 3 videos).

Add more plants on the **Manage data** page (`manage.php`).

The Species and Gallery pages show **10 items per page** with Previous / Next and page numbers.

## Adding photos and videos

**General field footage** (not tied to one species, e.g. the garden tour): put the file in `assets/videos/` and add a row
to `species_videos` with `species_id = NULL`. An optional `poster` (cover image file name) and `description` are supported:

```sql
INSERT INTO siargao_flora.species_videos (species_id, src, title, description, poster)
VALUES (NULL, 'my-clip.mp4', 'Mangrove walk', 'Del Carmen boardwalk', 'my-clip.jpg');
```

**Species photos and videos:**

Put files in `assets/images/species/` and `assets/videos/`, then add a row to `species_photos` / `species_videos`
with the file name as `src` (or use the API). A full URL or YouTube link also works. Until a photo exists,
the site shows an illustrated placeholder. A hero photo can go at `assets/images/hero.jpg`.

## Pages

`index.php` (home), `explore.php` (species directory), `species.php?id={slug}` (detail),
`gallery.php` (photos & videos), `about.php` (project + API docs). Shared header/footer in `includes/`.

## Project requirements checklist

| # | Requirement | Where it is |
|---|---|---|
| 1 | Relational database | `database/siargao_flora.sql` — 6 tables linked by foreign keys, plus a view. ERD: `docs/ERD-Siargao-Flora.png`. Diagram: **About → How the data is organized** |
| 2 | RESTful API in PHP + MySQL | `api/` — `species.php`, `categories.php`, `municipalities.php`, `videos.php`, `index.php` (health check) |
| 3 | GET, POST, PUT, DELETE | `api/species.php` supports all four. The website uses them on **Manage data** (`manage.php`) |
| 4 | JSON exchange | All requests/responses are JSON. Live view: **About → Try the API live** and the **API log** on `manage.php` |
| 5 | Website consumes its own API | Every page loads data through `assets/js/api.js` (`USE_API: true`) |
| 6 | Tested with Postman | `postman/` — collection (23 requests, 90 automatic tests) + environment |
| 7 | API reused by other applications | `examples/` — Plant of the Day widget (HTML/JS), Flora Report (server-side PHP), Python CLI client |

## Manage data (POST / PUT / DELETE from the website)

Open `manage.php` (footer → *Manage data*). Enter the `api_key` from your config file, then add, edit or delete
species. The **API log** shows each request's method, URL, status code, JSON body and JSON response.

## Testing with Postman

1. In Postman: **Import** → select both files in `postman/`.
2. Choose the **Siargao Flora - Local** environment (top right). Set `baseUrl` (default `http://localhost/flower&plant/api`)
   and `apiKey` (must match `api_key` in your config file).
3. Right-click the collection → **Run collection** → **Run**. All tests should pass.

The CRUD folder creates a temporary species, updates it, deletes it and confirms it is gone, so your data is unchanged.

## API reuse demos (`examples/`)

| Demo | Technology | How it uses the API |
|---|---|---|
| `plant-of-the-day.html` | HTML + JavaScript | Embeddable widget; `fetch()` from the browser |
| `php-report.php` | PHP (server side) | Calls the API over HTTP (curl), builds statistics — never touches the database |
| `flora_client.py` | Python 3 (standard library) | `python flora_client.py`, `python flora_client.py gumamela`, `python flora_client.py --town "Del Carmen"` |

Open `http://localhost/flower&plant/examples/` for an overview.

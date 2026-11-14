"""
REUSE DEMO 3 — Python command-line client for the Siargao Flora REST API.

Shows that an application written in a completely different language can use the same API.
Uses only the Python standard library (no installs needed).

    python flora_client.py                      list all species
    python flora_client.py gumamela             show one species
    python flora_client.py --town "Del Carmen"  species recorded in a municipality

Set the API address with the SIARGAO_FLORA_API environment variable if yours is different.
"""
import json
import os
import sys
import urllib.error
import urllib.parse
import urllib.request

API = os.environ.get("SIARGAO_FLORA_API", "http://localhost/flower&plant/api").rstrip("/")


def get(path, **params):
    """Send an HTTP GET request to the API and return the decoded JSON."""
    query = urllib.parse.urlencode({k: v for k, v in params.items() if v})
    url = f"{API}/{path}" + (f"?{query}" if query else "")
    request = urllib.request.Request(url, headers={"Accept": "application/json"})
    try:
        with urllib.request.urlopen(request, timeout=10) as response:
            return json.loads(response.read().decode("utf-8"))
    except urllib.error.HTTPError as err:
        body = json.loads(err.read().decode("utf-8") or "{}")
        sys.exit(f"API error {err.code}: {body.get('error', err.reason)}")
    except urllib.error.URLError as err:
        sys.exit(f"Could not reach the API at {API} ({err.reason}). Is Apache running?")


def show_list(town=None):
    species = get("species.php", municipality=town)["data"]
    title = f"Species recorded in {town}" if town else "All species"
    print(f"\n{title} ({len(species)})\n" + "-" * 64)
    for s in species:
        origin = "native" if s["native"] else "introduced"
        print(f"{s['local_name']:<16} {s['scientific_name']:<30} {s['category']:<12} {origin}")
    print()


def show_one(slug):
    s = get("species.php", id=slug)["data"]
    print(f"\n{s['local_name']} — {s['scientific_name']} ({s['common_name']})")
    print(f"Group: {s['category']} · Family: {s['family']} · Status: {s['status']}")
    print(f"Recorded in: {', '.join(s['municipalities'])}")
    print(f"\n{s['description']}\n")


if __name__ == "__main__":
    args = sys.argv[1:]
    if len(args) >= 2 and args[0] == "--town":
        show_list(args[1])
    elif args:
        show_one(args[0])
    else:
        show_list()

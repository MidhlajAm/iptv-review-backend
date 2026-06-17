# IPTV Review Backend (Xtream-Compatible Demo)

A lightweight, fully‑compliant Xtream API backend designed **exclusively** for Google Play app review.  
It serves a small set of demo live channels, movies, and series using public domain sample media.

---

## Credentials

| Field      | Value    |
|------------|----------|
| **Username** | `review` |
| **Password** | `review` |
| **Status**   | Active (max 1 connection) |

---

## Base URL

After deployment, your server will be available at:
https://your-render-url.onrender.com

For local testing: `http://localhost:3000`

---

## API Endpoints

All requests go through a single endpoint: **`GET /player_api.php`**  
Every call must include `username` and `password` as query parameters.

### Authentication
GET /player_api.php?username=review&password=review

Returns user info and server details.

### Live TV
- **Categories:** `?action=get_live_categories`
- **Streams:** `?action=get_live_streams` (optional `&category_id=X`)

### Movies (VOD)
- **Categories:** `?action=get_vod_categories`
- **Streams:** `?action=get_vod_streams` (optional `&category_id=X`)
- **Movie Info:** `?action=get_vod_info&vod_id=ID`

### Series
- **Categories:** `?action=get_series_categories`
- **Series List:** `?action=get_series` (optional `&category_id=X`)
- **Seasons & Episodes:** `?action=get_series_info&series_id=ID`

### Health Check
GET /health → { "status": "ok" }


---

## Streaming URLs (Playback)

The app constructs playback URLs locally using the IDs from the JSON responses.  
Your backend must support the following routes, which redirect to the actual `.mp4` files:

- **Live TV:** `/live/{username}/{password}/{stream_id}.ts`
- **Movies:** `/movie/{username}/{password}/{stream_id}.{ext}`
- **Series:** `/series/{username}/{password}/{episode_id}.{ext}`

All redirects point to the primary `stream_url` in the data files.

---

## Fallback & License Information

Every live stream, movie, and series episode now includes:

| Field           | Description |
|-----------------|-------------|
| `stream_url`    | Primary video URL |
| `fallback_url`  | Backup video URL (used if the primary fails) |
| `license`       | Always `"CC0 (Public Domain)"` – safe for review |

Your Android app can implement a fallback system that automatically switches to `fallback_url` when the primary stream fails, without any additional server calls.

---

## Sample Content

All videos are **public domain** samples served from Google's open media bucket:
- Big Buck Bunny  
- Elephants Dream  
- Sintel

These are provided **only** to demonstrate playback functionality.  
No commercial IPTV content is served.

---

## Local Development

1. **Clone the repository** and open the `backend` folder in VS Code.
2. Install dependencies:
   ```bash
   npm install
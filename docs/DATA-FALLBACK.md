# Jimbaran Hub — Node.js demo mode

Jimbaran Hub runs on Node.js/Express. MySQL is optional during the current demo phase.

## Default behavior

- If neither `DATABASE_URL` nor `DB_HOST` is configured, the server does not attempt a MySQL connection.
- Public read endpoints return hardcoded content from `src/data/fallback.js`.
- If MySQL is configured but the connection/query fails, public read endpoints automatically return the same hardcoded content.
- The GitHub Pages frontend also has local fallback content in `docs/js/app.js` and `docs/js/search.js`, so the public catalogue and search remain visible when the API is not configured or unavailable.
- The `/health` endpoint returns HTTP 200 and reports whether the database is connected or the app is in fallback mode.

## Demo endpoints with fallback

- `GET /api/health`
- `GET /api/products`
- `GET /api/products/:id`
- `GET /api/vehicles`
- `GET /api/destinations`
- `GET /api/gallery`
- `GET /api/tenants`
- `GET /api/events`
- `GET /api/stories`
- `GET /api/reviews`
- `GET /api/search?q=...`

Responses from the fallback endpoints include the `X-Data-Source: hardcode` response header.

## Start locally

```bash
npm install
npm start
```

Open `http://localhost:3000/health` and `http://localhost:3000/api/products`.

## Important limitations

Hardcoded data is for display/demo purposes only. It is not saved when the server restarts and is not editable through the admin dashboard.

Login, registration, bookings, payments, reviews submission, and admin CRUD require a working database. These write/authentication features are not simulated by the hardcoded fallback. Configure MySQL later by setting backend-only environment variables; never put database credentials in `docs/js/config.js` or commit a real `.env` file.

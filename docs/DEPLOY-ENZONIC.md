# Jimbaran Hub — Enzonic MySQL deployment

This repository keeps the static frontend on GitHub Pages and runs the Node.js API
on a Node-compatible backend host. The API connects to Enzonic MySQL over TLS.

## 1. Database

- Enzonic instance name: `jimbaran-hub`
- MySQL database/schema shown by Enzonic: `main`
- Import `database/schema.sql` into the primary `main` database branch.
- Confirm the tables appear in Enzonic before deploying the API.

## 2. Deploy the Node.js API

Connect this repository to a Node.js hosting provider (for example Render).

- Build command: `npm install`
- Start command: `npm start`
- Health check path: `/health`
- Node version: 20 or newer

## 3. Backend environment variables

Set these in the backend host's Environment/Secrets panel. Do not commit real
credentials or a populated `.env` file to GitHub.

Required variables:

- `DB_HOST`: Enzonic primary hostname
- `DB_PORT`: `3306`
- `DB_USER`: Enzonic database user
- `DB_PASSWORD`: newly rotated Enzonic password
- `DB_NAME`: `main`
- `DB_SSL`: `true`
- `JWT_SECRET`: a long, random secret
- `CORS_ORIGINS`: `https://ramandhika19.github.io`

The API also accepts a `DATABASE_URL` variable containing an Enzonic
`mysql://` connection URL. If used, it takes precedence over the individual
`DB_*` variables and TLS is enabled automatically.

## 4. Connect GitHub Pages to the API

After the API is deployed, edit `docs/js/config.js` and replace the placeholder
with the public API origin, without a trailing slash:

```js
window.JIMBARAN_CONFIG = {
  API_BASE_URL: "https://YOUR-BACKEND-HOST"
};
```

Commit the change. Never put MySQL credentials or `DATABASE_URL` in this
frontend file; browser JavaScript is public.

## 5. Verify

Open `https://YOUR-BACKEND-HOST/health`. A successful response is:

```json
{ "status": "ok", "database": "connected" }
```

If it returns HTTP 503, check the backend logs and the database environment
variables. Confirm the Enzonic branch is the primary writable branch and TLS
is enabled.

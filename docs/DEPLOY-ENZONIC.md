# Optional future MySQL deployment

MySQL is **not required for the current Jimbaran Hub demo**.

The current project runs in hardcoded demo mode:
- GitHub Pages renders local sample content from `docs/js/app.js` and `docs/js/search.js`.
- The Node.js API uses `src/data/fallback.js` when no database is configured or when MySQL cannot be reached.
- Keep `docs/js/config.js` with an empty `API_BASE_URL` until the Node.js API is deployed.

When database integration is wanted later, use the Enzonic connection settings as backend-only environment variables. Never put a MySQL password or connection URL in GitHub Pages JavaScript or commit it to the repository.

See [DATA-FALLBACK.md](./DATA-FALLBACK.md) for the current demo behavior and limitations.

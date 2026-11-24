# Web-facing interface

The app's backend abstraction (`src/api/index.js`) currently selects `createWebBackend()` from `src/api/web.js`:

| Method | Result |
|---|---|
| `isPortrait()` | Boolean from browser orientation media query; selects 9:16 vs. 16:9 game viewport. |
| `getCredentials()` | `{ username: string, password: '' }` from localStorage key `game-layer.username`. |
| `setCredentials({ username, password })` | Writes the username only. Password is ignored and never persisted. |
| `getStatus()` | Fetches `GET /api/status`; resolves to `{ ok: true }` or rejects on HTTP/network/invalid response. |

`GET /api/status` is the only app HTTP endpoint. A healthy service returns `200` with `{"ok":true}`. Any non-2xx response, transport failure or JSON without `ok: true` is an error shown in the login UI. In development, MSW supplies the endpoint; preview/production require a server providing it. This milestone has **no login/create HTTP requests** or authentication. Never transmit or persist the password from the current form.

Development-only mock-control routes under `/api/__mock/` are described in [MOCK_README.md](MOCK_README.md). They are not provided by a production build.

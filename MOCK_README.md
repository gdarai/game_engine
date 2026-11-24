# Local mock API

The Vite development server serves `mocks/mockServiceWorker.js` at `/mockServiceWorker.js`. The app starts MSW before its first `GET /api/status`. Preview and production do not start mocks; provide a real status endpoint there. API tests reuse the same handlers under MSW's Node server.

`mocks/handlers.js` registers the status endpoint. Its scenarios in `mocks/status.js` return `[httpStatus, jsonBody, optionalMemoryUpdate]`. `default` returns `200`, `{"ok":true}` and increments `statusChecks`; `error` returns `503`, `{"message":"Mock service unavailable"}`. Updates are shallow-merged into mock memory; do not mutate nested memory in place. Shared `mocks/memory.js` starts at `{}` and provides the `checked` snapshot `{statusChecks:1}`.

Scenario keys form an ordered stack, persisted in development-tab sessionStorage so they survive a refresh. The last active key implemented by an endpoint wins; otherwise the endpoint uses `default`. Unknown keys do not override a matching scenario. JavaScript controls in `mocks/mode.js` are `addKey`, `removeKey`, `clearKeys` and `getActiveKeys`; adding an existing key moves it to the top. Clearing keys does not reset memory. Mock memory itself resets on refresh.

From DevTools in development:

```js
await fetch('/api/__mock/addKey', {
  method: 'POST', body: JSON.stringify({ key: 'error' }),
})
await fetch('/api/status') // 503 while error is active
await fetch('/api/__mock/removeKey', {
  method: 'POST', body: JSON.stringify({ key: 'error' }),
})
await fetch('/api/__mock/clearKeys', { method: 'POST' })
await fetch('/api/__mock/getMemory') // Logs a memory snapshot to DevTools
await fetch('/api/__mock/resetMemory', {
  method: 'POST', body: JSON.stringify({ state: 'checked' }),
})
await fetch('/api/__mock/resetMemory', { method: 'POST' }) // Empty memory
```

Controls return `{"ok":true}` on success. Invalid keys, malformed control JSON and unknown memory snapshots return HTTP 400. `resetMemory` does not change scenario keys. Refresh the page to rerun the startup status check after changing scenarios; the keys survive the refresh.

# Local mock API

The development server starts an MSW browser worker before React mounts. It
intercepts the `POST /api/new/*` endpoints and `POST /api/play/get` documented in
[API_README.md](API_README.md). The same handlers run under MSW's Node server
in API tests. Preview and production builds do not start the mock.

## Endpoint files and scenarios

Each API has a corresponding file: for example, `/new/create` uses
`mocks/new/create.js`. Register new endpoints in `mocks/handlers.js`. Each
file exports a default object whose keys are scenario names and whose values
are functions. `default` is required. A handler receives `(apiBody,
mockMemory)` and returns `[returnCode, returnBody, toMemory]`, where
`returnCode` is an HTTP status, `returnBody` is JSON, and optional `toMemory`
is an object shallow-merged into the shared memory after the call. Read the
memory but do not mutate it in place: return replacements for any changed
nested objects. Returning no third value leaves memory unchanged.

## State keys

The global active-key stack starts empty (`[]`). For each API call, the
dispatcher uses the *last added* active key implemented by that endpoint;
if none match, it uses `default`. An unknown key does not override it; adding
an already active key moves it to the top without duplicating it.
Keys not implemented by a given endpoint do not affect that endpoint.

Import `addKey`, `removeKey`, `clearKeys`, and `getActiveKeys` from
`mocks/mode.js` to manage keys in JavaScript. `clearKeys()` does not touch
memory.

## Shared memory

The memory starts as `{}`. `resetMemory()` clears all memory;
`resetMemory('test1')` loads the named snapshot in `mocks/memory.js`
Define additional snapshots in `memoryStates` there. Unknown snapshot
names throw an error; loading a snapshot clones it so subsequent updates
cannot change the saved preset. Resetting memory does not change active keys.

## Browser controls

From DevTools on the development app, use the local-only controls:

```js
await fetch('/api/__mock/addKey', {
  method: 'POST', headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ key: 'error' }),
})
await fetch('/api/__mock/addKey', {
  method: 'POST', headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ key: 'test1' }),
})
await fetch('/api/__mock/removeKey', {
  method: 'POST', headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ key: 'error' }),
})
await fetch('/api/__mock/clearKeys', { method: 'POST' })
await fetch('/api/__mock/getMemory') // Log a snapshot of current memory to the console
await fetch('/api/__mock/resetMemory', {
  method: 'POST', headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ state: 'test1' }),
})
await fetch('/api/__mock/resetMemory', { method: 'POST' }) // Clean memory
```

`GET /api/__mock/getMemory` prints the current memory to the DevTools console
without changing it. Successful controls return `{ "ok": true }`; invalid
keys, malformed JSON in controls that read a body, or unknown memory snapshots
return HTTP 400.
These controls replace the old `/api/__mock/error` and `/api/__mock/reset`
endpoints.

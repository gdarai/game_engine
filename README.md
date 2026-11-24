# Game Layer

A lightweight, single-screen game app built with vanilla JavaScript, Vite and [LittleJS](https://github.com/KilledByAPixel/LittleJS). The animated game canvas sits behind an accessible browser form. The first scene is `login`; it currently has no authentication or navigation.

## Run

Requires Node.js 20.19+.

```sh
npm install
npm run dev
npm test
npm run build
npm run preview
```

Vite writes production files to `dist/`. The development server starts a local MSW backend before the app loads; preview/production do not include it. Provide a real `GET /api/status` endpoint for preview/production (see [API_README.md](API_README.md)).

## Layout

- `src/api`: backend contract and web implementation (HTTP status, browser orientation and local username storage).
- `src/assets`: self-hosted Inter font and its OFL license; `src/styles`: typography and responsive layout.
- `src/components`: DOM inputs/buttons and color-selectable SVG nine-patch skins.
- `src/scenes`: LittleJS scene and browser overlay; `src/utils`: shared scene/error state and pure geometry; `src/fixtures`: JavaScript test data.
- `mocks`: MSW scenarios, in-memory state, development controls and service worker. See [MOCK_README.md](MOCK_README.md).

The viewport fits within the browser at 9:16 in portrait or 16:9 in landscape; orientation never blocks input. Both buttons require a username and password, save **only** the username locally, and leave the login screen displayed. The password is not saved or restored. Startup loads the last username and checks backend status; errors appear in the form. See [AI_README.md](AI_README.md) for implementation conventions.

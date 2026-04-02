# Chuck Norris Jokes

A React SPA that streams Chuck Norris jokes from the [chucknorris.io](https://api.chucknorris.io) API. Browse jokes by category, start a live feed that adds a new joke every 5 seconds, and save up to 10 favourites — persisted in `localStorage`.

**Live:** https://danielgroen.github.io/chucknorris/

---

## Tech stack

- **React 18** + **TypeScript**
- **Vite** (build tool + dev server)
- **Tailwind CSS**
- **React Router v6**
- **Vitest** + **Testing Library** (unit tests)

---

## Getting started

**Requirements:** Node 20.5.1 (see `.nvmrc`)

```bash
# Install dependencies
npm install

# Start dev server at http://localhost:5173
npm run dev
```

---

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start the Vite dev server |
| `npm run build` | Type-check and build for production (`dist/`) |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Lint all `.ts`/`.tsx` files |
| `npm run lint:fix` | Lint and auto-fix |
| `npm test` | Run unit tests once |
| `npm run test:watch` | Run tests in watch mode |
| `npm run test:coverage` | Run tests with coverage report |

---

## Features

- **Browse by category** — jokes fetched once per category and cached in memory
- **Live feed** — toggle a 5-second timer that appends a new joke (oldest removed when the list exceeds 10)
- **Favourites** — save up to 10 jokes, persisted across sessions via `localStorage`

---

## Deployment

Pushes to `main` trigger a GitHub Actions workflow that:

1. Lints, type-checks, and runs tests
2. Builds with `VITE_BASE_PATH=/chucknorris/`
3. Deploys the `dist/` folder to GitHub Pages

# RecipeBox

A fullstack recipe app: browse, search, filter, create, edit, delete and favorite recipes, with a stats dashboard.

## Run it

```bash
npm install     # once, installs client + server + docs
npm run dev     # starts all three together
```

| What | URL |
|------|-----|
| Frontend (React + Vite) | http://localhost:5173 |
| Backend API (Express) | http://localhost:4000/api |
| API docs (OpenAPI / Swagger UI) | http://localhost:4001 |

The database is **in-memory SQLite**: nothing to install, and it resets to the 15 seeded recipes every time the server restarts (including when `tsx watch` restarts after you save a server file).

## Tech stack

- **Frontend**: React 19, TypeScript, Vite, React Router v6, Axios, CSS Modules
- **Backend**: Node.js, Express, TypeScript
- **Database**: SQLite (in-memory) via Drizzle ORM

## Project structure

```
client/src/
  app/                 router
  features/<feature>/  components/, hooks/, api/, types/   (recipes, favorites, dashboard)
  shared/              components, hooks, utils, types used by more than one feature
server/src/
  server.ts            seeds the db, starts listening
  app.ts               middleware + mounts /api
  routes.ts            mounts each module
  modules/<module>/    <module>.routes -> .controller -> .service -> .repository (+ .types)
  middleware/          errorHandler
  shared/              custom errors, shared types
  db/                  schema, in-memory connection, seed data
docs/openapi.yaml      the API contract shown on :4001
```

## Backend layers

A request flows **routes -> controller -> service -> repository -> db**:

- **routes** map a method + path to a controller method
- **controller** reads `req.params` / `req.query` / `req.body`, validates it by hand, calls the service, sends the response
- **service** business rules (clamping, "not found" errors, shaping data)
- **repository** the only layer that talks to the database

Errors are thrown as `ValidationError` (400) / `NotFoundError` (404) and turned into JSON by `middleware/errorHandler.ts`.

## API

See http://localhost:4001 for the interactive version (source: `docs/openapi.yaml`).

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/recipes` | List recipes (paginated, filterable, sortable) |
| GET | `/api/recipes/:id` | Get single recipe |
| POST | `/api/recipes` | Create recipe |
| PUT | `/api/recipes/:id` | Update recipe |
| DELETE | `/api/recipes/:id` | Delete recipe |
| GET | `/api/stats` | Dashboard statistics |
| GET | `/api/stats/featured` | Random featured recipes (3 by default, `?count=` up to 10) |

## Frontend features

- Browse recipes with pagination
- Search by title with debounced input
- Filter by cuisine, difficulty, vegetarian status
- Sort by prep time, created date, or title
- Create and edit recipes with dynamic ingredient lists
- Delete recipes with confirmation
- Favorite recipes (client-side context)
- Dashboard with stats and featured recipes
- Cook timer on recipe detail pages
- Error boundaries and loading states
- Custom hooks (useRecipes, useDebouncedValue)

## To-Do

Work through these using only the code, the docs at http://localhost:4001, and the browser. Check each one with Swagger UI or the app.

### Backend

Repositories are pre-written, and so are `GET /api/recipes` (filtering, sorting, pagination) and `GET /api/recipes/:id`. Look for `🔴 TODO` comments in `recipe.controller.ts` and `recipe.service.ts`. Validate by hand, no libraries. The body validation helper (`validateBody`) and `parseId` are already written for you.

- [ ] **`POST /api/recipes`**: controller validates the body and returns `201`; service fills in the timestamps and saves.
- [ ] **`PUT /api/recipes/:id`**: controller reads the id and the body; service checks the recipe exists (`404` if not) and saves the update.
- [ ] **`DELETE /api/recipes/:id`**: controller reads the id and returns `204`; service checks the recipe exists (`404` if not), then deletes.
- [ ] **`GET /api/stats/featured?count=`**: read the optional `count` query param (default 3, whole number 1–10, otherwise `400`) in the controller and pass it through the service.
- [ ] **Bonus:** add `totalTimeMinutes` (prep + cook) to every recipe returned by `GET /api/recipes` and `GET /api/recipes/:id`.

Check each endpoint in the docs at http://localhost:4001 before wiring it to the frontend.

### Frontend

Look for `🔴 TODO` comments in each file. These files are stubbed and need implementing:

- [ ] **Dashboard:** `dashboardApi.ts`, `Dashboard.tsx`, `StatsPanel.tsx`, `FeaturedRecipes.tsx`
- [ ] **Recipes:** `recipeApi.ts`, `useRecipes.ts`, `RecipeList.tsx`, `RecipeCard.tsx`, `RecipeDetail.tsx`, `RecipeForm.tsx`, `CookTimer.tsx`
- [ ] **Favorites:** `FavoritesContext.tsx`, `FavoriteButton.tsx`, `FavoritesPage.tsx`

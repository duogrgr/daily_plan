# AGENTS.md — Day Orbit

## Project Overview

Day Orbit is a single-page gamified daily planner designed as a Telegram Mini App. The core visual is an animated planet whose appearance changes with the time of day. Completed tasks populate an orbital ring around the planet.

## Architecture

```
src/
  routes/
    __root.tsx         Root layout — fonts, meta, Telegram WebApp script
    index.tsx          Main page: planet visualization + task list UI
  server/
    tasks.server.ts    Private DB helper functions (not exported to client)
    tasks.functions.ts Public server functions (createServerFn wrappers)
  styles.css           Global styles, animations, planet CSS

db/
  schema.ts            Drizzle schema — tasks table
  index.ts             Drizzle client (drizzle-orm/netlify-db)

netlify/
  database/
    migrations/        Auto-generated SQL migration files

drizzle.config.ts      Drizzle Kit config — points output to netlify/database/migrations
```

## Key Conventions

- Server functions live in `src/server/tasks.functions.ts` and use `.inputValidator()` (not `.validator()`).
- DB helpers live in `src/server/tasks.server.ts` — never imported on the client directly.
- Drizzle ORM uses the `@beta` dist-tag. Always install `drizzle-orm@beta` and `drizzle-kit@beta`.
- Migrations are generated with `npx drizzle-kit generate` and applied automatically by Netlify on deploy.
- Tasks are date-scoped: the `date` column stores a `YYYY-MM-DD` string.

## Planet Theming

The planet appearance is driven by `getTimePhase(hour)` returning one of five phases: dawn, morning, afternoon, dusk, night. Each phase provides CSS radial-gradient values for the sphere, atmosphere, and shadow overlay. Shadow intensity increases at night to simulate the terminator line.

## Gamification

- Priority levels: low = +10xp, medium = +20xp, high = +30xp
- XP bar fills based on earned xp vs. tasks.length * 20
- Orbital dots: one per completed task, positioned trigonometrically around the planet

## Telegram Mini App

- `window.Telegram.WebApp.expand()` and `.ready()` are called on mount
- `HapticFeedback.impactOccurred("light")` fires on task toggle
- The Telegram script is injected in `__root.tsx` via the `scripts` head option
- All Telegram calls are guarded with optional chaining for browser compatibility

## Styling Notes

- CSS custom property `--accent` is set on the root container and drives button/checkbox colors
- `.planet-float` applies a subtle vertical float animation to the planet
- `.orbit-dot-pop` is a one-shot pop animation for new orbital dots
- `.slide-up` staggers task list entries on load
- Dynamic values (planet gradients, dot positions) use inline styles

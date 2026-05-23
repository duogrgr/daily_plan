# Day Orbit — Gamified Daily Planner

A gamified daily task planner built as a Telegram Mini App. The centerpiece is an animated planet/sphere that responds to the time of day and your task completion progress.

## Key Features

- **Living planet**: A CSS sphere that shifts colors and shadow depth based on the hour — warm coral at dawn, teal in morning, blue in afternoon, orange/purple at dusk, and deep indigo at night.
- **Orbital progress**: Completed tasks appear as glowing dots orbiting the planet. The more you complete, the more the orbit fills.
- **Task management**: Add, complete, edit (double-click), and delete tasks. Three priority levels (low / medium / high) each award different XP.
- **XP system**: Completing tasks earns experience points, tracked in a live progress bar.
- **Telegram Mini App**: Integrates with `window.Telegram.WebApp` for fullscreen expansion and haptic feedback on task completion.
- **Persistent storage**: Tasks are stored in a Netlify Postgres database via Drizzle ORM, scoped by day (YYYY-MM-DD).

## Tech Stack

- **Framework**: TanStack Start (React + Vite)
- **Styling**: Tailwind CSS v4 + custom CSS animations
- **Database**: Netlify Database (Postgres) via `@netlify/database` + `drizzle-orm@beta`
- **Fonts**: Sora (UI) + DM Mono (numbers/xp)
- **Deployment**: Netlify

## Running Locally

```bash
npm install
netlify dev
```

The app runs on `http://localhost:8888`.

To test as a Telegram Mini App, configure the app URL in BotFather and open it via your Telegram bot.

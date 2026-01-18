# Round‑Robin Tournament Backend
A TypeScript + Express.js  backend for managing small round‑robin tournaments with up to five players.
This project includes a clean service‑controller architecture, PostgreSQL integration, Docker support, and a complete API for tournament lifecycle management.

## Features
- Create tournaments and players

- Add players to tournaments (max 5)

- Automatically generate round‑robin match schedules

- Submit match results

## Compute leaderboard using:

- 2 points → win

- 1 point → draw

- 0 points → loss

## Track tournament status:

- planning

- started

- finished

## Fully containerized with Docker

Organized, scalable folder structure (controllers, services, utils, models)

# Round-robin Tournament Service

Backend service to manage small round-robin tournaments (up to 5 participants).

## Tech stack

- Node.js
- TypeScript
- Express
- SQLite (better-sqlite3)

## Setup

```bash
npm install
npm run dev

Service runs at http://localhost:3000



import { Router } from "express";
import { db } from "../db";
import { getLeaderboard, getTournamentStatus } from "../services/tournament.service";

export const tournamentsRouter = Router();

// Create tournament
tournamentsRouter.post("/", (req, res) => {
  const { name } = req.body;
  if (!name) {
    return res.status(400).json({ error: "name is required" });
  }

  const stmt = db.prepare("INSERT INTO tournaments (name) VALUES (?)");
  const info = stmt.run(name);

  const tournament = db
    .prepare("SELECT * FROM tournaments WHERE id = ?")
    .get(info.lastInsertRowid as number);

  res.status(201).json(tournament);
});

// List tournaments
tournamentsRouter.get("/", (_req, res) => {
  const tournaments = db.prepare("SELECT * FROM tournaments").all();
  res.json(tournaments);
});

// Add player to tournament
tournamentsRouter.post("/:id/players", (req, res) => {
  const tournamentId = Number(req.params.id);
  const { player_id } = req.body;

  if (!player_id) {
    return res.status(400).json({ error: "player_id is required" });
  }

  const playerCountRow = db
    .prepare(
      "SELECT COUNT(*) as count FROM tournament_players WHERE tournament_id = ?"
    )
    .get(tournamentId) as { count: number };

  if (playerCountRow.count >= 5) {
    return res.status(400).json({ error: "Tournament already has 5 participants" });
  }

  try {
    db.prepare(
      "INSERT INTO tournament_players (tournament_id, player_id) VALUES (?, ?)"
    ).run(tournamentId, player_id);
  } catch (e) {
    return res.status(400).json({ error: "Could not add player to tournament" });
  }

  res.status(201).json({ tournament_id: tournamentId, player_id });
});

// Tournament status + leaderboard
tournamentsRouter.get("/:id/status", (req, res) => {
  const tournamentId = Number(req.params.id);

  const tournament = db
    .prepare("SELECT * FROM tournaments WHERE id = ?")
    .get(tournamentId);

  if (!tournament) {
    return res.status(404).json({ error: "Tournament not found" });
  }

  const status = getTournamentStatus(tournamentId);
  const leaderboard = getLeaderboard(tournamentId);

  res.json({
    tournament,
    status,
    leaderboard,
  });
});

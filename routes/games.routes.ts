import { Router } from "express";
import { db } from "../db";

export const gamesRouter = Router();

// Enter game result
gamesRouter.post("/", (req, res) => {
  const {
    tournament_id,
    home_player_id,
    away_player_id,
    home_score,
    away_score,
  } = req.body;

  if (
    !tournament_id ||
    !home_player_id ||
    !away_player_id ||
    home_score === undefined ||
    away_score === undefined
  ) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  if (home_player_id === away_player_id) {
    return res.status(400).json({ error: "A player cannot play against themselves" });
  }

  // Ensure both players are in the tournament
  const playersInTournament = db
    .prepare(
      `
      SELECT COUNT(*) as count
      FROM tournament_players
      WHERE tournament_id = ?
        AND player_id IN (?, ?)
    `
    )
    .get(tournament_id, home_player_id, away_player_id) as { count: number };

  if (playersInTournament.count !== 2) {
    return res
      .status(400)
      .json({ error: "Both players must belong to the tournament" });
  }

  // Normalize pair (home/away uniqueness per pair)
  const existing = db
    .prepare(
      `
      SELECT * FROM games
      WHERE tournament_id = ?
        AND (
          (home_player_id = ? AND away_player_id = ?)
          OR (home_player_id = ? AND away_player_id = ?)
        )
    `
    )
    .get(
      tournament_id,
      home_player_id,
      away_player_id,
      away_player_id,
      home_player_id
    );

  if (existing) {
    return res.status(400).json({ error: "These players already played in this tournament" });
  }

  const stmt = db.prepare(
    `
    INSERT INTO games (tournament_id, home_player_id, away_player_id, home_score, away_score)
    VALUES (?, ?, ?, ?, ?)
  `
  );

  const info = stmt.run(
    tournament_id,
    home_player_id,
    away_player_id,
    home_score,
    away_score
  );

  const game = db
    .prepare("SELECT * FROM games WHERE id = ?")
    .get(info.lastInsertRowid as number);

  res.status(201).json(game);
});

// List games for a tournament
gamesRouter.get("/tournament/:id", (req, res) => {
  const tournamentId = Number(req.params.id);
  const games = db
    .prepare("SELECT * FROM games WHERE tournament_id = ?")
    .all(tournamentId);
  res.json(games);
});

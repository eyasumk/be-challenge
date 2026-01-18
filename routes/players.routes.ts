import { Router } from "express";
import { db } from "../db";

export const playersRouter = Router();

// Create player
playersRouter.post("/", (req, res) => {
  const { name } = req.body;
  if (!name) {
    return res.status(400).json({ error: "name is required" });
  }

  const stmt = db.prepare("INSERT INTO players (name) VALUES (?)");
  const info = stmt.run(name);

  const player = db
    .prepare("SELECT * FROM players WHERE id = ?")
    .get(info.lastInsertRowid as number);

  res.status(201).json(player);
});

// List players
playersRouter.get("/", (_req, res) => {
  const players = db.prepare("SELECT * FROM players").all();
  res.json(players);
});

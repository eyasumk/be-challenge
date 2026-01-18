import { db } from "../db";
import { TournamentStatus } from "../models/tournament.model";

interface LeaderboardRow {
  player_id: number;
  name: string;
  points: number;
  games_played: number;
}

export function getTournamentStatus(tournamentId: number): TournamentStatus {
  const playersStmt = db.prepare(
    "SELECT COUNT(*) as count FROM tournament_players WHERE tournament_id = ?"
  );
  const { count: playerCount } = playersStmt.get(tournamentId) as { count: number };

  if (playerCount === 0) {
    return "planning";
  }

  const gamesStmt = db.prepare(
    "SELECT COUNT(*) as count FROM games WHERE tournament_id = ?"
  );
  const { count: gameCount } = gamesStmt.get(tournamentId) as { count: number };

  const expectedGames = (playerCount * (playerCount - 1)) / 2;

  if (gameCount === 0) {
    return "planning";
  }

  if (gameCount < expectedGames) {
    return "started";
  }

  return "finished";
}

export function getLeaderboard(tournamentId: number): LeaderboardRow[] {
  const players = db
    .prepare(
      `
      SELECT p.id, p.name
      FROM players p
      INNER JOIN tournament_players tp ON tp.player_id = p.id
      WHERE tp.tournament_id = ?
    `
    )
    .all(tournamentId) as { id: number; name: string }[];

  const pointsMap = new Map<number, LeaderboardRow>();

  for (const p of players) {
    pointsMap.set(p.id, {
      player_id: p.id,
      name: p.name,
      points: 0,
      games_played: 0,
    });
  }

  const games = db
    .prepare(
      `
      SELECT * FROM games
      WHERE tournament_id = ?
    `
    )
    .all(tournamentId) as any[];

  for (const g of games) {
    const home = pointsMap.get(g.home_player_id);
    const away = pointsMap.get(g.away_player_id);
    if (!home || !away) continue;

    home.games_played += 1;
    away.games_played += 1;

    if (g.home_score > g.away_score) {
      home.points += 2;
    } else if (g.home_score < g.away_score) {
      away.points += 2;
    } else {
      home.points += 1;
      away.points += 1;
    }
  }

  const leaderboard = Array.from(pointsMap.values());
  leaderboard.sort((a, b) => b.points - a.points || a.name.localeCompare(b.name));
  return leaderboard;
}

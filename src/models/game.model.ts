export interface Game {
  id: number;
  tournament_id: number;
  home_player_id: number;
  away_player_id: number;
  home_score: number;
  away_score: number;
  played_at: string;
}

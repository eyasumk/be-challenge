export type TournamentStatus = "planning" | "started" | "finished";

export interface Tournament {
  id: number;
  name: string;
  created_at: string;
}

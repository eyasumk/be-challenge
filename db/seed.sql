INSERT INTO players (name) VALUES
  ('Alice'),
  ('Bob'),
  ('Charlie'),
  ('Diana');

INSERT INTO tournaments (name) VALUES ('Sample Tournament');

INSERT INTO tournament_players (tournament_id, player_id)
SELECT 1, id FROM players;

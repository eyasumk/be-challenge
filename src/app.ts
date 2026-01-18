import express from "express";
import cors from "cors";
import morgan from "morgan";
import { tournamentsRouter } from "./routes/tournaments.routes";
import { playersRouter } from "./routes/players.routes";
import { gamesRouter } from "./routes/games.routes";
import "./db"; // ensure DB and schema are initialized

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.use("/tournaments", tournamentsRouter);
app.use("/players", playersRouter);
app.use("/games", gamesRouter);

export { app };

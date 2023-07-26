import { Router } from "express";
import { getGames, insertGame } from "../controllers/games.controllers.js";
import { validateSchema } from "../middlewares/validateSchema.js";
import { gameSchemas } from "../schemas/games.schemas.js";

const gamesRouter = Router()

gamesRouter.get("/games", getGames)
gamesRouter.post("/games", validateSchema(gameSchemas), insertGame)

export default gamesRouter
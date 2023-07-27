import { Router } from "express";
import { deleteRental, finishRental, getRentals, insertRental } from "../controllers/rentals.controllers.js";
import { validateSchema } from "../middlewares/validateSchema.js";
import { rentalsSchema } from "../schemas/rentals.schemas.js";

const rentalsRouter = Router()

rentalsRouter.get("/rentals", getRentals)
rentalsRouter.post("/rentals", validateSchema(rentalsSchema), insertRental)
rentalsRouter.post("/rentals/:id/return", finishRental)
rentalsRouter.delete("/rentals/:id", deleteRental)

export default rentalsRouter
import { Router } from "express";
import { deleteRental, finishRental, getRentals, insertRental } from "../controllers/rentals.controllers.js";

const rentalsRouter = Router()

rentalsRouter.get("/rentals", getRentals)
rentalsRouter.post("/rentals", insertRental)
rentalsRouter.post("/rentals/:id/return", finishRental)
rentalsRouter.delete("/rentals/:id", deleteRental)

export default rentalsRouter
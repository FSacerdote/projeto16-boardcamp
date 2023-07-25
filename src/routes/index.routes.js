import { Router } from "express";
import gamesRouter from "./games.routes";
import customersRouter from "./customers.routes";
import rentalsRouter from "./rentals.routes";

const router = Router()
router.use(customersRouter)
router.use(gamesRouter)
router.use(rentalsRouter)

export default router
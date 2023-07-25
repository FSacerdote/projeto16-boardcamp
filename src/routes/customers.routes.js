import { Router } from "express";

const customersRouter = Router()

customersRouter.get("/customers")
customersRouter.get("/customers/:id")
customersRouter.post("/customers")
customersRouter.post("/customers/:id")

export default customersRouter
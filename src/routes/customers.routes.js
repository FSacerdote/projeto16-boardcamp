import { Router } from "express";
import { getCustomerById, getCustomers, insertCustomer, updateCustomer } from "../controllers/customers.controllers.js";
import { validateSchema } from "../middlewares/validateSchema.js";
import { customersSchema } from "../schemas/customers.schemas.js";

const customersRouter = Router()

customersRouter.get("/customers", getCustomers)
customersRouter.get("/customers/:id", getCustomerById)
customersRouter.post("/customers", validateSchema(customersSchema), insertCustomer)
customersRouter.put("/customers/:id", validateSchema(customersSchema), updateCustomer)

export default customersRouter
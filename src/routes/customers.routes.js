import { Router } from "express";
import { getCustomerById, getCustomers, insertCustomer, updateCustomer } from "../controllers/customers.controllers";

const customersRouter = Router()

customersRouter.get("/customers", getCustomers)
customersRouter.get("/customers/:id", getCustomerById)
customersRouter.post("/customers", insertCustomer)
customersRouter.post("/customers/:id", updateCustomer)

export default customersRouter
import dotenv from "dotenv"
import express from "express"
import cors from "cors"
import router from "./routes/index.routes.js"

dotenv.config()
const port = process.env.PORT || 5000

const app = express()
app.use(cors())
app.use(express.json())
app.use(router)

app.listen(port, ()=> console.log(`Servidor rodando na porta: ${port}`))
import dayjs from "dayjs"
import { db } from "../database/database.connection.js"

export async function getRentals(req, res){

}

export async function insertRental(req, res){
    const {customerId, gameId, daysRented} = req.body
    try {
        const game = await db.query("SELECT * FROM games WHERE id=$1;", [gameId])
        const customer = await db.query("SELECT * FROM customers WHERE id=$1;", [customerId])
        if(!game.rowCount || !customer.rowCount) return res.status(400).send("Jogo ou cliente não encontrados")
        const rentals = await db.query(`SELECT * FROM rentals WHERE "gameId"=$1;`, [gameId])
        if(rentals.rowCount >= game.rows[0].stockTotal) return res.status(400).send("Jogo não está disponível")
        const originalPrice = daysRented * game.rows[0].pricePerDay
        await db.query(`
        INSERT INTO rentals ("customerId", "gameId", "rentDate", "daysRented", "returnDate", "originalPrice", "delayFee") VALUES ($1, $2, $3, $4, $5, $6, $7);
        `, [customerId, gameId, dayjs().format("YYYY-MM-DD"), daysRented, null,  originalPrice, null])
        res.sendStatus(201)
    } catch (error) {
        res.status(500).send(error.message)
    }
}

export async function finishRental(req, res){

}

export async function deleteRental(req, res){
    const {id} = req.params
    try {
        const rental = await db.query("SELECT * FROM rentals WHERE id=$1;", [id])
        if(!rental.rowCount) return res.status(404).send("O aluguel selecionado não existe")
        if(!rental.rows[0].returnDate) return res.status(404).send("O aluguel não está fechado")
        await db.query(`DELETE FROM rentals WHERE id=$1;`, [id])
        res.sendStatus(200)
    } catch (error) {
        res.status(500).send(error.message)
    }
}
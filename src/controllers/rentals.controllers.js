import dayjs from "dayjs"
import { db } from "../database/database.connection.js"
import isSameOrAfter from "dayjs/plugin/isSameOrAfter.js"

export async function getRentals(req, res) {
    dayjs.extend(isSameOrAfter)
    const {gameId, customerId, limit, offset, order, desc, status, startDate} = req.query
    let rentals
    try {
        if (order) {
            rentals = await db.query(
                `SELECT rentals.*, customers.id AS customer_id, customers.name AS customer_name, games.id AS game_id, games.name AS game_name FROM rentals
                JOIN games ON rentals."gameId" = games.id
                JOIN customers ON rentals."customerId" = customers.id
                WHERE
                    (CAST($1 AS INTEGER) IS NULL OR rentals."customerId" = CAST($1 AS INTEGER))
                    AND
                    (CAST($2 AS INTEGER) IS NULL OR rentals."gameId" = CAST($2 AS INTEGER))
                ORDER BY "${order}" ${desc?"DESC":"ASC"}
                LIMIT $3 OFFSET $4;`, [customerId, gameId, limit, offset]
        )
        } else {
            rentals = await db.query(
                    `SELECT rentals.*, customers.id AS customer_id, customers.name AS customer_name, games.id AS game_id, games.name AS game_name FROM rentals
                    JOIN games ON rentals."gameId" = games.id
                    JOIN customers ON rentals."customerId" = customers.id
                    WHERE
                        (CAST($1 AS INTEGER) IS NULL OR rentals."customerId" = CAST($1 AS INTEGER))
                        AND
                        (CAST($2 AS INTEGER) IS NULL OR rentals."gameId" = CAST($2 AS INTEGER))
                    LIMIT $3 OFFSET $4;`, [customerId, gameId, limit, offset]
            )
        }
        if(status === "open") rentals.rows = rentals.rows.filter((rental)=> !rental.returnDate)
        if(status === "closed") rentals.rows = rentals.rows.filter((rental)=> rental.returnDate)
        if(startDate) rentals.rows = rentals.rows.filter((rental)=> dayjs(rental.rentDate, "day").isSameOrAfter(startDate))
        res.send(rentals.rows.map(({ customer_id, customer_name, game_id, game_name, ...rental }) => ({
            ...rental,
            customer: {
                id: customer_id,
                name: customer_name
            },
            game: {
                id: game_id,
                name: game_name
            }
        })))
    } catch (error) {
        res.status(500).send(error.message)
    }
}

export async function insertRental(req, res) {
    const { customerId, gameId, daysRented } = req.body
    try {
        const game = await db.query("SELECT * FROM games WHERE id=$1;", [gameId])
        const customer = await db.query("SELECT * FROM customers WHERE id=$1;", [customerId])
        if (!game.rowCount || !customer.rowCount) return res.status(400).send("Jogo ou cliente não encontrados")
        const rentals = await db.query(`SELECT * FROM rentals WHERE "gameId"=$1;`, [gameId])
        if (rentals.rowCount >= game.rows[0].stockTotal) return res.status(400).send("Jogo não está disponível")
        const originalPrice = daysRented * game.rows[0].pricePerDay
        await db.query(`
        INSERT INTO rentals ("customerId", "gameId", "rentDate", "daysRented", "returnDate", "originalPrice", "delayFee") VALUES ($1, $2, $3, $4, $5, $6, $7);
        `, [customerId, gameId, dayjs().format("YYYY-MM-DD"), daysRented, null, originalPrice, null])
        res.sendStatus(201)
    } catch (error) {
        res.status(500).send(error.message)
    }
}

export async function finishRental(req, res) {
    const { id } = req.params
    try {
        const rental = await db.query(`
            SELECT rentals.*, games."pricePerDay" FROM rentals 
            JOIN games ON rentals."gameId" = games.id
            WHERE rentals.id=$1;`
            , [id])
        if (!rental.rowCount) return res.sendStatus(404)
        if (rental.rows[0].returnDate) return res.sendStatus(400)
        const returnDate = dayjs()
        const delayFee = (returnDate.diff(rental.rows[0].rentDate, "day") - rental.rows[0].daysRented) * rental.rows[0].pricePerDay
        await db.query(`UPDATE rentals SET "returnDate"=$1, "delayFee"=$2 WHERE id=$3;`, [returnDate, (delayFee > 0 ? delayFee : 0), id])
        res.sendStatus(200)
    } catch (error) {
        res.status(500).send(error.message)
    }
}

export async function deleteRental(req, res) {
    const { id } = req.params
    try {
        const rental = await db.query("SELECT * FROM rentals WHERE id=$1;", [id])
        if (!rental.rowCount) return res.status(404).send("O aluguel selecionado não existe")
        if (!rental.rows[0].returnDate) return res.status(400).send("O aluguel não está fechado")
        await db.query(`DELETE FROM rentals WHERE id=$1;`, [id])
        res.sendStatus(200)
    } catch (error) {
        res.status(500).send(error.message)
    }
}
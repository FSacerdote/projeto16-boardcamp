import { db } from "../database/database.connection.js";

export async function getGames(req, res){
    const {name, offset, limit, order, desc} = req.query
    const namePattern = `${name?name:""}%`
    let games
    try {
        if(order){
            games =  await db.query(`SELECT * FROM games WHERE name ILIKE $1 ORDER BY ${order} ${desc?"DESC":"ASC"} LIMIT $2 OFFSET $3 ;`, [namePattern, limit, offset])
        }else{
            games =  await db.query(`SELECT * FROM games WHERE name ILIKE $1 LIMIT $2 OFFSET $3 ;`, [namePattern, limit, offset])
        }
        res.send(games.rows)
    } catch (error) {
        res.status(500).send(error.message)
    }
}

export async function insertGame(req, res){

    const { name, image, stockTotal, pricePerDay } = req.body

    try {
        const game = await db.query("SELECT * FROM games WHERE name=$1;", [name])
        console.log(game.rows)
        if (game.rowCount) return res.sendStatus(409)
        await db.query(`INSERT INTO games (name, image, "stockTotal", "pricePerDay") VALUES ($1, $2, $3, $4)`,[name, image, stockTotal, pricePerDay])
        res.sendStatus(201)
    } catch (error) {
        res.status(500).send(error.message)
    }
}
import { db } from "../database/database.connection.js"

export async function getCustomers(req, res){
    const {cpf, limit, offset, order, desc} = req.query
    const cpfPattern = `${cpf?cpf:""}%`
    let customers
    try {
        if(order){
            customers = await db.query(`
            SELECT id, name, phone, cpf, TO_CHAR(birthday, 'YYYY-MM-DD') AS birthday 
            FROM customers 
            WHERE cpf ILIKE $1
            ORDER BY ${order} ${desc?"DESC":"ASC"}
            LIMIT $2 OFFSET $3;`, 
            [cpfPattern, limit, offset])
        }else{
            customers = await db.query(`
            SELECT id, name, phone, cpf, TO_CHAR(birthday, 'YYYY-MM-DD') AS birthday FROM customers WHERE cpf ILIKE $1 LIMIT $2 OFFSET $3;`, 
            [cpfPattern, limit, offset])
        }
        res.send(customers.rows)
    } catch (error) {
        res.status(500).send(error.message)
    }
}

export async function getCustomerById(req, res){

    const {id} = req.params

    try {
        const customer = await db.query("SELECT id, name, phone, cpf, TO_CHAR(birthday, 'YYYY-MM-DD') AS birthday FROM customers WHERE id=$1;", [id])
        if (!customer.rowCount) return res.sendStatus(404)
        res.send(customer.rows[0])
    } catch (error) {
        res.status(500).send(error.message)
    }
}

export async function insertCustomer(req, res){
    const { name, phone, cpf, birthday } = req.body

    try {
        const customer = await db.query("SELECT * FROM customers WHERE cpf=$1;", [cpf])
        if(customer.rowCount) return res.sendStatus(409)
        await db.query(`INSERT INTO customers (name, phone, cpf, birthday) VALUES ($1, $2, $3, $4);`, [name, phone, cpf, birthday])
        res.sendStatus(201)
    } catch (error) {
        res.status(500).send(error.message)
    }
}

export async function updateCustomer(req, res){
    const {id} = req.params
    const { name, phone, cpf, birthday } = req.body

    try {
        const customer = await db.query("SELECT * FROM customers WHERE cpf=$1 AND id<>$2;", [cpf, id])
        if(customer.rowCount) return res.sendStatus(409)
        await db.query(`UPDATE customers SET name=$1, phone=$2, cpf=$3, birthday=$4 WHERE id=$5`, [name, phone, cpf, birthday, id])
        res.sendStatus(200)
    } catch (error) {
        res.status(500).send(error.message)
    }
}
import joi from "joi"

export const gameSchemas = joi.object({
    name: joi.string().required(),
    image: joi.string().required(),
    stockTotal: joi.number().integer().positive().required(),
    pricePerDay: joi.number().positive().required()
})
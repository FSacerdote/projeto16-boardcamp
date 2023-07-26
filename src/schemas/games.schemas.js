import joi from "joi"

export const gameSchemas = joi.object({
    name: joi.string().required(),
    image: joi.string().required(),
    stockTotal: joi.number().integer().greater(0).required(),
    pricePerDay: joi.number().integer().greater(0).required()
})
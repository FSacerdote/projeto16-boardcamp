import joi, { required } from "joi"

export const gameSchemas = joi.object({
    name: joi.string().required(),
    image: joi.string().required(),
    stockTotal: joi.number().integer().required(),
    pricePerDay: joi.number().required()
})
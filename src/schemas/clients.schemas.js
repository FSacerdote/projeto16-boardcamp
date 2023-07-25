import joi, { string } from "joi"

export const clientSchema = joi.object({
    name: string().required(),
    phone: string().required(),
    cpf: string().required(),
    birthday: string().required()
})
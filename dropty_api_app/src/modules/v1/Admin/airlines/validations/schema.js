const Joi = require("@hapi/joi");

const airlineCreateSchema = Joi.object({
  airlineName: Joi.string().min(2).required(),

  airlineLogo: Joi.string().uri().allow(null, ""),

  isActive: Joi.boolean().optional()
}).unknown(false); // 🔒 BLOCK extra fields


const airlineUpdateSchema = Joi.object({
  airlineName: Joi.string().min(2).optional(),

  airlineLogo: Joi.string().uri().allow(null, ""),

  isActive: Joi.boolean().optional()
}).unknown(false);

const extraBagFareSchema = Joi.object({
  flightType: Joi.string()                
    .valid("domestic", "international")
    .required(),

  baggageType: Joi.string()
    .valid("bag", "weight")
    .required(),

  additionalKg: Joi.number()
    .positive()
    .required(),

  additionalKgFare: Joi.number()
    .positive()
    .required()
}).unknown(false); 

module.exports = {
  airlineCreateSchema,
  airlineUpdateSchema,
  extraBagFareSchema
};

const Joi = require("@hapi/joi");

const schema = {
  createCrew: Joi.object({
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    email: Joi.string().email().allow(null, ""),
    mobile_number: Joi.string().required(),
    gender: Joi.string().valid("male", "female", "other").allow(null, ""),
    dateOfBirth: Joi.date().allow(null, ""),
  }),

  updateCrew: Joi.object({
    firstName: Joi.string().optional(),
    lastName: Joi.string().optional(),
    email: Joi.string().email().allow(null, ""),
    gender: Joi.string().valid("male", "female", "other").allow(null, ""),
    dateOfBirth: Joi.date().allow(null, ""),
  }),

  updateCrewStatus: Joi.object({
    userId: Joi.number().integer().required(), // must pass integer ID in body
  }),

  validateCrewUnique: Joi.object({
    userId: Joi.number().integer().optional(),
    email: Joi.string().email().allow(null, ""),
    mobile_number: Joi.string().allow(null, "")
  }).or("email", "mobile_number")

};

module.exports = schema;
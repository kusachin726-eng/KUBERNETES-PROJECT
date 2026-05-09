const Joi = require("@hapi/joi");

const schema = {
    addCity: Joi.object({
        city: Joi.string().required(),
        state: Joi.string().required(),
        country: Joi.string().required(),
        countryCode: Joi.string().required(),
        stateCode: Joi.string().uppercase().required(),
        pincode: Joi.array().items(Joi.string()).min(1).required(),
      }),
      updateCity: Joi.object({
        city: Joi.string().optional(),
        state: Joi.string().allow(null, "").optional(),
        country: Joi.string().optional(),
        countryCode: Joi.string().allow(null, "").optional(),
        stateCode: Joi.string().uppercase().required().optional(),
        pincode: Joi.array().items(Joi.string()).min(1).optional(),
      }),

      updateCityStatus: Joi.object({
        id: Joi.number().required()
      }),

     deleteCity: Joi.object({
        id: Joi.number().required()
      }),
      
      
};

module.exports = schema;
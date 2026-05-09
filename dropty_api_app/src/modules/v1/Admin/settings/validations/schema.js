const Joi = require("@hapi/joi");

const schema = {
  addSettings: Joi.object({
    title: Joi.string().trim().required().messages({
      "string.empty": "Title is required",
      "any.required": "Title is required"
    }),
    metaData: Joi.object().required().min(1)
    .custom((value, helpers) => {
      if (Array.isArray(value)) {
        return helpers.error("any.invalid");
      }
      return value;
    })
    .messages({
      "object.base": "metaData must be a JSON object",
      "object.min": "metaData cannot be empty",
      "any.invalid": "metaData must be an object, not an array",
      "any.required": "metaData is required"
    }),
    isActive: Joi.boolean().optional()
  }),

  updateSettings: Joi.object({
    title: Joi.string().trim().min(2).optional().messages({
      "string.empty": "Title cannot be empty",
      "string.min": "Title must be at least 2 characters"
    }),
    metaData: Joi.object().min(1).optional().messages({
      "object.base": "metaData must be a valid JSON object",
      "object.min": "metaData cannot be empty"
    }),
    slug: Joi.forbidden().messages({
      "any.unknown": "Slug cannot be updated"
    }),
    isActive: Joi.forbidden().messages({
      "any.unknown": "isActive cannot be updated"
    })
  }),
  
  settingsIdParam: Joi.object({
    id: Joi.number().integer().min(1).required()
  })
};

module.exports = schema;
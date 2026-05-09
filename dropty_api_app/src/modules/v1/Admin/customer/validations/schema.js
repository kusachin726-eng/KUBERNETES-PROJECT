const Joi = require("@hapi/joi");

const schema = {
    customerValiadations: Joi.object({
        email: Joi.string().email().allow(null, ''),
        isActive: Joi.boolean().optional(),
        firstName: Joi.string().min(2).max(30).allow(null, ""),
        lastName: Joi.string().min(2).max(30).allow(null, ""),
        dateOfBirth: Joi.date().optional().allow(null, ""),
        gender: Joi.string().valid("male", "female", "other").optional().allow(null, ""),
        bio: Joi.string().max(500).optional().allow(null, ""),
        avatarUrl: Joi.string().uri().optional().allow(null, "")
    }),
};

module.exports = schema;
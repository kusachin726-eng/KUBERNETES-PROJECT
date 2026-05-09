const joi = require("@hapi/joi");

const schema = {
    createProfileSchema: joi.object({
        firstName: joi.string().min(2).max(30).required(),
        lastName: joi.string().min(2).max(30).required(),
        dateOfBirth: joi.date().optional().allow(null, ""),
        gender: joi.string().valid("male", "female", "other").optional().allow(null, ""),
        bio: joi.string().max(500).optional().allow(null, ""),
        avatarUrl: joi.string().optional().allow(null, "")
    })
}

module.exports = schema;
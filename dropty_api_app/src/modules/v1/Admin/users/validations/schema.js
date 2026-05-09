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

    userValidationsSchema: Joi.object({
        email: Joi.string().email().required().messages({
            'string.empty': 'Email is required',
            'any.required': 'Email is required',
            'string.email': 'Email must be a valid email address'
        }),
        mobile_number: Joi.string()
            .pattern(/^[0-9]{10}$/)
            .required()
            .messages({
                'string.empty': 'Mobile number is required',
                'any.required': 'Mobile number is required',
                'string.pattern.base': 'Mobile number must be exactly 10 digits'
            }),
        password: Joi.string().min(6).allow(null, ''),
        firstName: Joi.string().min(2).max(30).allow(null, ""),
        lastName: Joi.string().min(2).max(30).allow(null, ""),
        dateOfBirth: Joi.date().optional().allow(null, ""),
        gender: Joi.string().valid("male", "female", "other").optional().allow(null, ""),
        bio: Joi.string().max(500).optional().allow(null, ""),
        avatarUrl: Joi.string().uri().optional().allow(null, "")
    })
};

module.exports = schema;
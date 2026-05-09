const Joi = require("@hapi/joi");

const schema = {
    rolePermissions: Joi.object({
        title: Joi.string().min(3).max(100).required(),
        isActive: Joi.boolean().default(true),
    }),

    adminDetails: Joi.object({
        email: Joi.string().email({ tlds: { allow: false } }).required(),
        mobile_number: Joi.string().pattern(/^\d{10}$/).required()
            .messages({ 'string.base': 'Invalid Mobile Number', 'string.pattern.base': 'Invalid Mobile Number' }),
        password: Joi.string().min(6).required(),
        admin_role_id: Joi.number().integer().allow(null),
        isActive: Joi.boolean().default(true),
    }),


};

module.exports = schema;
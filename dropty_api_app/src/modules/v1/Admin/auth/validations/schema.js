const Joi = require("@hapi/joi");

const schema = {
    verifyLoginPassword: Joi.object({
        // Prefer `login` for CRM. Keep `email` optional for backward compatibility.
        login: Joi.string().trim().min(1),
        email: Joi.string().email({ tlds: { allow: false } }),
        password: Joi.string().min(1).required(),
        device_type: Joi.string().allow(null, ""),
    }).or("login", "email"),

    registerAdmin: Joi.object({
        email: Joi.string().email({ tlds: { allow: false } }).required(),
        mobile_number: Joi.string().pattern(/^\d{10}$/).required()
                    .messages({ 'string.base': 'Invalid Mobile Number', 'string.pattern.base': 'Invalid Mobile Number' }),
        password: Joi.string().min(6).required(),
        admin_role_id: Joi.number().integer().allow(null),
    }),
};

module.exports = schema;
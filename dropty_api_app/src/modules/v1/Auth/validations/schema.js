const joi = require("@hapi/joi");

const schema = {
    checkMobile: joi.object({
        mobile_number: joi.string().pattern(/^\d{10}$/).required()
            .messages({ 'string.base': 'Invalid Mobile Number', 'string.pattern.base': 'Invalid Mobile Number' }),
        country_code: joi.string().required(),
        user_type: joi.string().valid('customer', 'admin','crew','airport_manager', 'airport_crew','operations_manager','customer_service','driver').required()        
    }),
    checkOtp: joi.object({
        mobile_number: joi.string().pattern(/^\d{10}$/).required()
            .messages({ 'string.base': 'Invalid Mobile Number', 'string.pattern.base': 'Invalid Mobile Number' }),
        country_code: joi.string().required(),
        otp: joi.string().length(6).pattern(/^\d+$/).required()
            .messages({ 'string.base': 'Invalid OTP', 'string.length': 'OTP must be 6 digits', 'string.pattern.base': 'OTP must contain only digits' }),
        user_type: joi.string().valid('customer', 'admin','crew','airport_manager', 'airport_crew','operations_manager','customer_service','driver').required(),
        device_id: joi.string().optional(),
        fcm_token: joi.string().optional(),
        device_type: joi.string().valid('android', 'ios', 'web', 'mobile', 'desktop').optional(),
        isDeleteUser: joi.boolean().optional()
    }),
    customerCheckMobile: joi.object({
        mobileNumber: joi.number().integer().min(1000000000)
            .message("Invalid Mobile Number")
            .max(9999999999).message("Invalid Mobile number").required(),
        countryCode: joi.string().required()
    }),
}

module.exports = schema;
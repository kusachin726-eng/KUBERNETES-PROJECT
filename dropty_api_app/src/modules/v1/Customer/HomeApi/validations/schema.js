const joi = require("@hapi/joi");

const schema = {
    bannerValidationSchema: joi.object({
        bannerId: joi.number().allow(null, 0),
        bannerType: joi.string().required(),
        title: joi.string().allow(null, ""),
        description: joi.string().allow(null, ""),
        imageUrl: joi.string().required(),
        linkUrl: joi.string().allow(null, ""),
        position: joi.number().allow(null, 0),
        startDate: joi.date().allow(null, ""),
        expireDate: joi.date().allow(null, ""),
        status: joi.string().valid("active", "inactive").allow(null, "active"),
    })
}

module.exports = schema;
const validate = require("../../../../../middleware/validator");
const { createVendor, getVendorListQuerySchema, vehicleSchema, vehicleListSchema, assignVendorSchema, idValidationSchema, updateVendorSchema, vehicleUpdateSchema, createDriverSchema, driverListSchema, driverUpdateSchema } = require("./schema");

module.exports = {
    createVendor: validate({ body: createVendor }),
    getVendorList: validate({ query: getVendorListQuerySchema }),
    updateVendor: validate({ params: idValidationSchema,body: updateVendorSchema }),

    vehicleSchema: validate({ body: vehicleSchema }),
    vehicleListValidation: validate({ query: vehicleListSchema }),
    vehicleUpdateValidation: validate({ params: idValidationSchema, body: vehicleUpdateSchema }),

    createDriverValidation: validate({ body: createDriverSchema }),
    driverListValidation: validate({ query: driverListSchema }),
    updateDriverValidation: validate({ params: idValidationSchema, body: driverUpdateSchema }),

    assignVendorSchema: validate({ body: assignVendorSchema }),

    idParamValidation: validate({ params: idValidationSchema })
};
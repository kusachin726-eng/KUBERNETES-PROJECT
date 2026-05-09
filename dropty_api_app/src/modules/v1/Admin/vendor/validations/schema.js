const Joi = require('@hapi/joi');

const vendorSchema = {
    createVendor: Joi.object({
        vendorName: Joi.string().required(),
        vendorCode: Joi.string().required().uppercase(),
        contactPersonName: Joi.string().required(),
        contactEmail: Joi.string().email().required(),
        contactPhone: Joi.string().required(),
        addressLine1: Joi.string().optional(),
        addressLine2: Joi.string().optional(),
        city: Joi.string().optional(),
        state: Joi.string().optional(),
        zipCode: Joi.string().optional(),
        bankAccountNumber: Joi.string().optional(),
        bankIFSC: Joi.string().optional(),
        bankAccountHolder: Joi.string().optional(),
        estimatedCommissionPercentage: Joi.number().precision(2).min(0).max(100).optional()
    }),

    getVendorListQuerySchema: Joi.object({
        page: Joi.number().optional(),
        limit: Joi.number().optional(),
        status: Joi.string().valid('active', 'inactive').optional(),
        searchKey: Joi.string().optional()
    }),

    idValidationSchema: Joi.object({
        id: Joi.number().required()
    }),

    updateVendorSchema: Joi.object({
        vendorName: Joi.string().optional(),
        contactPersonName: Joi.string().optional(),
        contactEmail: Joi.string().email().optional(),
        contactPhone: Joi.string().optional(),
        addressLine1: Joi.string().optional(),
        addressLine2: Joi.string().optional(),
        city: Joi.string().optional(),
        state: Joi.string().optional(),
        zipCode: Joi.string().optional(),
        bankAccountNumber: Joi.string().optional(),
        bankIFSC: Joi.string().optional(),
        bankAccountHolder: Joi.string().optional(),
        estimatedCommissionPercentage: Joi.number().precision(2).min(0).max(100).optional()
    }),

    vehicleSchema: Joi.object({
        vendorId: Joi.number().required(),
        vehicleRegistrationNumber: Joi.string().required().uppercase(),
        vehicleModel: Joi.string().required(),
        capacityKg: Joi.number().precision(2).required(),
        capacityVolumeCubicMeter: Joi.number().precision(2).required(),
        acquisitionDate: Joi.date().optional(),
        insuranceExpiryDate: Joi.date().optional(),
        pollutionCertificateExpiryDate: Joi.date().optional(),
        lastMaintenanceDate: Joi.date().optional(),
        nextMaintenanceDueDate: Joi.date().optional(),
        notes: Joi.string().optional()
    }),

    vehicleListSchema: Joi.object({
        page: Joi.number().optional(),
        limit: Joi.number().optional(),
        vendorId: Joi.number().optional(),
        status: Joi.string().valid('available', 'booked', 'maintenance', 'inactive').optional(),
        searchKey: Joi.string().optional()
    }),

    vehicleUpdateSchema: Joi.object({
        vehicleModel: Joi.string().optional(),
        capacityKg: Joi.number().precision(2).optional(),
        capacityVolumeCubicMeter: Joi.number().precision(2).optional(),
        insuranceExpiryDate: Joi.date().optional(),
        pollutionCertificateExpiryDate: Joi.date().optional(),
        lastMaintenanceDate: Joi.date().optional(),
        nextMaintenanceDueDate: Joi.date().optional(),
        notes: Joi.string().optional()
    }),

    createDriverSchema: Joi.object({
        vendorId: Joi.number().required(),
        firstName: Joi.string().required(),
        lastName: Joi.string().required(),
        email: Joi.string().email().optional(),
        phoneNumber: Joi.string().required(),
        licenseNumber: Joi.string().required(),
        licenseExpiryDate: Joi.date().required(),
        aadharNumber: Joi.string().optional(),
        dateOfBirth: Joi.date().optional(),
        addressLine1: Joi.string().optional(),
        addressLine2: Joi.string().optional(),
        city: Joi.string().optional(),
        state: Joi.string().optional(),
        zipCode: Joi.string().optional(),
        bankAccountNumber: Joi.string().optional(),
        bankIFSC: Joi.string().optional(),
        bankAccountHolder: Joi.string().optional(),
        experienceYears: Joi.number().optional(),
        emergencyContactName: Joi.string().optional(),
        emergencyContactPhone: Joi.string().optional()
    }),

    driverListSchema: Joi.object({
        page: Joi.number().optional(),
        limit: Joi.number().optional(),
        vendorId: Joi.number().optional(),
        status: Joi.string().valid('available', 'on-trip', 'on-break', 'inactive').optional(),
        searchKey: Joi.string().optional()
    }),

    driverUpdateSchema: Joi.object({
        firstName: Joi.string().optional(),
        lastName: Joi.string().optional(),
        email: Joi.string().email().optional(),
        phoneNumber: Joi.string().optional(),
        licenseExpiryDate: Joi.date().optional(),
        dateOfBirth: Joi.date().optional(),
        addressLine1: Joi.string().optional(),
        addressLine2: Joi.string().optional(),
        city: Joi.string().optional(),
        state: Joi.string().optional(),
        zipCode: Joi.string().optional(),
        bankAccountNumber: Joi.string().optional(),
        bankIFSC: Joi.string().optional(),
        bankAccountHolder: Joi.string().optional(),
        experienceYears: Joi.number().optional(),
        emergencyContactName: Joi.string().optional(),
        emergencyContactPhone: Joi.string().optional()
    }),

    assignVendorSchema: Joi.object({
        vendorId: Joi.number().required(),
        vehicleId: Joi.number().required(),
        driverId: Joi.number().required(),
        bookingAmount: Joi.number().precision(2).optional()
    })
};

module.exports = vendorSchema;

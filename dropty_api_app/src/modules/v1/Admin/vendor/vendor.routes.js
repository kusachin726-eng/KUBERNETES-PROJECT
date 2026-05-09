const express = require('express');
const router = express.Router();
const catchAsyncErr = require('../../../../utils/errorHandler/catchAsyncErr');
const VendorController = require('./vendor.controller');
const validate = require('../../../../middleware/validator');
const Joi = require('@hapi/joi');
const checkRole = require('../../../../middleware/auth/checkRole');
const { createVendor, getVendorList, updateVendor, idParamValidation, vehicleSchema, vehicleListValidation, vehicleUpdateValidation, createDriverValidation, driverListValidation, updateDriverValidation } = require("./validations");
const authenticateJWT = require("../../../../middleware/auth/checkRole");
const checkPermission = require("../../../../middleware/auth/rbac");
/**
 * ============ VENDOR ROUTES ============
 */

// Create vendor (admin only)
router.post(
    '/registerNewVendor',
    authenticateJWT(['admin']),
    checkPermission('vendor', 'canCreate'),
    createVendor,
    catchAsyncErr(VendorController.createVendor.bind(VendorController))
);

// Get all vendors
router.get(
    '/vendorList',
    authenticateJWT(['admin']),
    checkPermission('vendor', 'canView'),
    getVendorList,
    catchAsyncErr(VendorController.getAllVendors.bind(VendorController))
);

// Get vendor by ID
router.get(
    '/vendorDetails/:id',
    idParamValidation,
    authenticateJWT(['admin']),
    checkPermission('vendor', 'canView'),
    catchAsyncErr(VendorController.getVendorById.bind(VendorController))
);

// Update vendor
router.put(
    '/vendorUpdate/:id',
    authenticateJWT(['admin']),
    checkPermission('vendor', 'canEdit'),
    updateVendor,
    catchAsyncErr(VendorController.updateVendor.bind(VendorController))
);

// Toggle vendor status
router.patch(
    '/vendorChangeStatus/:id',
    authenticateJWT(['admin']),
    checkPermission('vendor', 'canEdit'),
    idParamValidation,
    catchAsyncErr(VendorController.toggleVendorStatus.bind(VendorController))
);

// Delete vendor
router.delete(
    '/vendorDelete/:id',
    authenticateJWT(['admin']),
    checkPermission('vendor', 'canDelete'),
    idParamValidation,
    catchAsyncErr(VendorController.deleteVendor.bind(VendorController))
);

// Get vendor stats
router.get(
    '/vendor/:id/stats',
    authenticateJWT(['admin']),
    checkPermission('vendor', 'canView'),
    idParamValidation,
    catchAsyncErr(VendorController.getVendorStats.bind(VendorController))
);

/**
 * ============ VEHICLE ROUTES ============
 */

// Create vehicle
router.post(
    '/vehicle',
    authenticateJWT(['admin']),
    checkPermission('vendor', 'canCreate'),
    vehicleSchema,
    catchAsyncErr(VendorController.createVehicle.bind(VendorController))
);

// Get all vehicles
router.get(
    '/vehicle',
    authenticateJWT(['admin']),
    checkPermission('vendor', 'canView'),
    vehicleListValidation,
    catchAsyncErr(VendorController.getAllVehicles.bind(VendorController))
);

// Get vehicle by ID
router.get(
    '/vehicle/:id',
    authenticateJWT(['admin']),
    checkPermission('vendor', 'canView'),
    idParamValidation,
    catchAsyncErr(VendorController.getVehicleById.bind(VendorController))
);

// Update vehicle
router.put(
    '/vehicle/:id',
    authenticateJWT(['admin']),
    checkPermission('vendor', 'canEdit'),
    vehicleUpdateValidation,
    catchAsyncErr(VendorController.updateVehicle.bind(VendorController))
);

// Update vehicle status
router.patch(
    '/vehicleStatus/:id',
    validate({
        params: Joi.object({
            id: Joi.number().required()
        }),
        body: Joi.object({
            status: Joi.string().valid('available', 'booked', 'maintenance', 'inactive').required()
        })
    }),
    authenticateJWT(['admin']),
    checkPermission('vendor', 'canEdit'),    
    catchAsyncErr(VendorController.updateVehicleStatus.bind(VendorController))
);

// Get available vehicles by vendor
router.get(
    '/vendor/:vendorId/available-vehicles',
    checkRole(['admin']),
    idParamValidation,
    catchAsyncErr(VendorController.getAvailableVehiclesByVendor.bind(VendorController))
);

// Check vehicle maintenance
router.get(
    '/vehicle/:id/maintenance',
    checkRole(['admin']),
    idParamValidation,
    catchAsyncErr(VendorController.checkVehicleMaintenance.bind(VendorController))
);

// Delete vehicle
router.delete(
    '/vehicle/:id',
    authenticateJWT(['admin']),
    checkPermission('vendor', 'canDelete'),
    idParamValidation,
    vehicleUpdateValidation,
    catchAsyncErr(VendorController.deleteVehicle.bind(VendorController))
);

/**
 * ============ DRIVER ROUTES ============
 */

// Create driver
router.post(
    '/driver',
    authenticateJWT(['admin']),
    checkPermission('vendor', 'canCreate'),
    createDriverValidation,
    catchAsyncErr(VendorController.createDriver.bind(VendorController))
);

// Get all drivers
router.get(
    '/driver',
    authenticateJWT(['admin']),
    checkPermission('vendor', 'canView'),
    driverListValidation,
    catchAsyncErr(VendorController.getAllDrivers.bind(VendorController))
);

// Get driver by ID
router.get(
    '/driver/:id',
    authenticateJWT(['admin']),
    checkPermission('vendor', 'canView'),
    idParamValidation,
    catchAsyncErr(VendorController.getDriverById.bind(VendorController))
);

// Update driver
router.put(
    '/driver/:id',
    authenticateJWT(['admin']),
    checkPermission('vendor', 'canEdit'),
    updateDriverValidation,
    catchAsyncErr(VendorController.updateDriver.bind(VendorController))
);

// Update driver status
router.patch(
    '/driverStatus/:id',
    validate({
        params: Joi.object({
            id: Joi.number().required()
        }),
        body: Joi.object({
            status: Joi.string().valid('available', 'on-trip', 'on-break', 'inactive').required()
        })
    }),
    authenticateJWT(['admin']),
    checkPermission('vendor', 'canEdit'),
    catchAsyncErr(VendorController.updateDriverStatus.bind(VendorController))
);

// Get available drivers by vendor
router.get(
    '/vendor/:vendorId/available-drivers',
    checkRole(['admin']),
    idParamValidation,
    catchAsyncErr(VendorController.getAvailableDriversByVendor.bind(VendorController))
);

// Check driver license
router.get(
    '/driver/:id/license',
    checkRole(['admin']),
    idParamValidation,
    catchAsyncErr(VendorController.checkDriverLicense.bind(VendorController))
);

// Delete driver
router.delete(
    '/driver/:id',
    idParamValidation,
    authenticateJWT(['admin']),
    checkPermission('vendor', 'canDelete'),
    catchAsyncErr(VendorController.deleteDriver.bind(VendorController))
);

/**
 * ============ BOOKING VENDOR ASSIGNMENT ROUTES ============
 */

// Assign vendor to booking
router.post(
    '/booking/:bookingId/assign-vendor',
    checkRole(['admin']),
    validate({
        params: Joi.object({
            bookingId: Joi.number().required()
        }),
        body: Joi.object({
            vendorId: Joi.number().required(),
            vehicleId: Joi.number().required(),
            driverId: Joi.number().required(),
            bookingAmount: Joi.number().precision(2).optional()
        })
    }),
    catchAsyncErr(VendorController.assignVendorToBooking.bind(VendorController))
);

// Confirm pickup
router.patch(
    '/booking/:bookingId/confirm-pickup',
    checkRole(['admin']),
    validate({
        params: Joi.object({
            bookingId: Joi.number().required()
        })
    }),
    catchAsyncErr(VendorController.confirmPickupAssignment.bind(VendorController))
);

// Unassign vendor
router.patch(
    '/booking/:bookingId/unassign-vendor',
    checkRole(['admin']),
    validate({
        params: Joi.object({
            bookingId: Joi.number().required()
        })
    }),
    catchAsyncErr(VendorController.unassignVendor.bind(VendorController))
);

// Get booking with vendor details
router.get(
    '/booking/:bookingId/vendor-details',
    checkRole(['admin']),
    validate({
        params: Joi.object({
            bookingId: Joi.number().required()
        })
    }),
    catchAsyncErr(VendorController.getBookingWithVendorDetails.bind(VendorController))
);



module.exports = router;

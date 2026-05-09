const VendorService = require('./vendor.service');
const VehicleService = require('./vehicle.service');
const DriverService = require('./driver.service');
const BookingVendorService = require('./bookingVendor.service');
const AppError = require('../../../../utils/errorHandler/appError');

class VendorController {

  /**
   * ============ VENDOR MANAGEMENT ============
   */

  async createVendor(req, res, next) {
    const { vendorName, vendorCode, contactPersonName, contactEmail, contactPhone, ...rest } = req.body;

    const vendorData = {
      vendorName,
      vendorCode,
      contactPersonName,
      contactEmail,
      contactPhone,
      ...rest
    };

    const vendor = await VendorService.createVendor(vendorData);

    res.status(201).json({
      status: true,
      message: 'Vendor created successfully',
      data: vendor
    });
  }

  async getAllVendors(req, res, next) {
    const { page, limit, status, searchKey } = req.query;

    const result = await VendorService.getAllVendors({
      page: parseInt(page) || 1,
      limit: parseInt(limit) || 10,
      status,
      searchKey
    });

    res.json({
      status: true,
      message: 'Vendors retrieved successfully',
      ...result
    });
  }

  async getVendorById(req, res, next) {
    const { id } = req.params;

    const vendor = await VendorService.getVendorById(parseInt(id));

    res.json({
      status: true,
      message: 'Vendor retrieved successfully',
      data: vendor
    });
  }

  async updateVendor(req, res, next) {
    const { id } = req.params;

    const vendor = await VendorService.updateVendor(parseInt(id), req.body);

    res.json({
      status: true,
      message: 'Vendor updated successfully',
      data: vendor
    });
  }

  async toggleVendorStatus(req, res, next) {
    const { id } = req.params;

    const vendor = await VendorService.toggleVendorStatus(parseInt(id));

    res.json({
      status: true,
      message: `Vendor ${vendor.isActive ? 'activated' : 'deactivated'} successfully`,
      data: vendor
    });
  }

  async deleteVendor(req, res, next) {
    const { id } = req.params;

    const result = await VendorService.deleteVendor(parseInt(id));

    res.json({
      status: true,
      message: result.message,
      data: {}
    });
  }

  async getVendorStats(req, res, next) {
    const { id } = req.params;

    const stats = await VendorService.getVendorStats(parseInt(id));

    res.json({
      status: true,
      message: 'Vendor statistics retrieved successfully',
      data: stats
    });
  }

  /**
   * ============ VEHICLE MANAGEMENT ============
   */

  async createVehicle(req, res, next) {
    const vehicleData = req.body;

    const vehicle = await VehicleService.createVehicle(vehicleData);

    res.status(201).json({
      status: true,
      message: 'Vehicle created successfully',
      data: vehicle
    });
  }

  async getAllVehicles(req, res, next) {
    const { page, limit, vendorId, status, searchKey } = req.query;

    const result = await VehicleService.getAllVehicles({
      page: parseInt(page) || 1,
      limit: parseInt(limit) || 10,
      vendorId: vendorId ? parseInt(vendorId) : null,
      status,
      searchKey
    });

    res.json({
      status: true,
      message: 'Vehicles retrieved successfully',
      ...result
    });
  }

  async getVehicleById(req, res, next) {
    const { id } = req.params;

    const vehicle = await VehicleService.getVehicleById(parseInt(id));

    res.json({
      status: true,
      message: 'Vehicle retrieved successfully',
      data: vehicle
    });
  }

  async updateVehicle(req, res, next) {
    const { id } = req.params;

    const vehicle = await VehicleService.updateVehicle(parseInt(id), req.body);

    res.json({
      status: true,
      message: 'Vehicle updated successfully',
      data: vehicle
    });
  }

  async updateVehicleStatus(req, res, next) {
    const { id } = req.params;
    const { status } = req.body;

    const vehicle = await VehicleService.updateVehicleStatus(parseInt(id), status);

    res.json({
      status: true,
      message: `Vehicle status updated to ${status}`,
      data: vehicle
    });
  }

  async getAvailableVehiclesByVendor(req, res, next) {
    const { vendorId } = req.params;

    const vehicles = await VehicleService.getAvailableVehiclesByVendor(parseInt(vendorId));

    res.json({
      status: true,
      message: 'Available vehicles retrieved successfully',
      data: vehicles
    });
  }

  async deleteVehicle(req, res, next) {
    const { id } = req.params;

    const result = await VehicleService.deleteVehicle(parseInt(id));

    res.json({
      status: true,
      message: result.message,
      data: {}
    });
  }

  async checkVehicleMaintenance(req, res, next) {
    const { id } = req.params;

    const maintenanceStatus = await VehicleService.checkMaintenanceStatus(parseInt(id));

    res.json({
      status: true,
      message: 'Vehicle maintenance status retrieved',
      data: maintenanceStatus
    });
  }

  /**
   * ============ DRIVER MANAGEMENT ============
   */

  async createDriver(req, res, next) {
    const driverData = req.body;

    const driver = await DriverService.createDriver(driverData);

    res.status(201).json({
      status: true,
      message: 'Driver created successfully',
      data: driver
    });
  }

  async getAllDrivers(req, res, next) {
    const { page, limit, vendorId, status, searchKey } = req.query;

    const result = await DriverService.getAllDrivers({
      page: parseInt(page) || 1,
      limit: parseInt(limit) || 10,
      vendorId: vendorId ? parseInt(vendorId) : null,
      status,
      searchKey
    });

    res.json({
      status: true,
      message: 'Drivers retrieved successfully',
      ...result
    });
  }

  async getDriverById(req, res, next) {
    const { id } = req.params;

    const driver = await DriverService.getDriverById(parseInt(id));

    res.json({
      status: true,
      message: 'Driver retrieved successfully',
      data: driver
    });
  }

  async updateDriver(req, res, next) {
    const { id } = req.params;

    const driver = await DriverService.updateDriver(parseInt(id), req.body);

    res.json({
      status: true,
      message: 'Driver updated successfully',
      data: driver
    });
  }

  async updateDriverStatus(req, res, next) {
    const { id } = req.params;
    const { status } = req.body;

    const driver = await DriverService.updateDriverStatus(parseInt(id), status);

    res.json({
      status: true,
      message: `Driver status updated to ${status}`,
      data: driver
    });
  }

  async getAvailableDriversByVendor(req, res, next) {
    const { vendorId } = req.params;

    const drivers = await DriverService.getAvailableDriversByVendor(parseInt(vendorId));

    res.json({
      status: true,
      message: 'Available drivers retrieved successfully',
      data: drivers
    });
  }

  async deleteDriver(req, res, next) {
    const { id } = req.params;

    const result = await DriverService.deleteDriver(parseInt(id));

    res.json({
      status: true,
      message: result.message,
      data: {}
    });
  }

  async checkDriverLicense(req, res, next) {
    const { id } = req.params;

    const licenseStatus = await DriverService.checkLicenseValidity(parseInt(id));

    res.json({
      status: true,
      message: 'Driver license status retrieved',
      data: licenseStatus
    });
  }

  /**
   * ============ BOOKING VENDOR ASSIGNMENT ============
   */

  async assignVendorToBooking(req, res, next) {
    const { bookingId } = req.params;
    const { vendorId, vehicleId, driverId, bookingAmount } = req.body;

    const logistics = await BookingVendorService.assignVendorToBooking(
      parseInt(bookingId),
      { vendorId, vehicleId, driverId, bookingAmount }
    );

    res.json({
      status: true,
      message: 'Vendor assigned to booking successfully',
      data: logistics
    });
  }

  async confirmPickupAssignment(req, res, next) {
    const { bookingId } = req.params;

    const logistics = await BookingVendorService.confirmPickupAssignment(parseInt(bookingId));

    res.json({
      status: true,
      message: 'Vendor pickup confirmed',
      data: logistics
    });
  }

  async unassignVendor(req, res, next) {
    const { bookingId } = req.params;

    const logistics = await BookingVendorService.unassignVendor(parseInt(bookingId));

    res.json({
      status: true,
      message: 'Vendor unassigned from booking',
      data: logistics
    });
  }

  async getBookingWithVendorDetails(req, res, next) {
    const { bookingId } = req.params;

    const booking = await BookingVendorService.getBookingWithVendorDetails(parseInt(bookingId));

    res.json({
      status: true,
      message: 'Booking with vendor details retrieved',
      data: booking
    });
  }

  
}

module.exports = new VendorController();

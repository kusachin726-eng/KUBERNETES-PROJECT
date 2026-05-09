const { Op } = require('sequelize');
const db = require('../../../../data-access/sequelize/models');
const AppError = require('../../../../utils/errorHandler/appError');

class DriverService {
  /**
   * Create a new driver
   */
  async createDriver(driverData) {
    try {
      // Verify vendor exists
      const vendor = await db.Vendor.findByPk(driverData.vendorId);
      if (!vendor) {
        throw new AppError('Vendor not found', 404);
      }

      // Check if license number already exists
      const existingDriver = await db.VehicleDriver.findOne({
        where: { licenseNumber: driverData.licenseNumber }
      });

      if (existingDriver) {
        throw new AppError('License number already registered', 409);
      }

      // Check if aadhar number already exists (if provided)
      if (driverData.aadharNumber) {
        const existingAadhar = await db.VehicleDriver.findOne({
          where: { aadharNumber: driverData.aadharNumber }
        });

        if (existingAadhar) {
          throw new AppError('Aadhar number already registered', 409);
        }
      }

      const driver = await db.VehicleDriver.create(driverData);
      return driver;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get all drivers with filters
   */
  async getAllDrivers(options = {}) {
    try {
      const { page = 1, limit = 10, vendorId, status, searchKey } = options;
      const offset = (page - 1) * limit;

      const where = {};
      if (vendorId) where.vendorId = vendorId;
      if (status) where.status = status;

      if (searchKey) {
        where[Op.or] = [
          { firstName: { [Op.iLike]: `%${searchKey}%` } },
          { lastName: { [Op.iLike]: `%${searchKey}%` } },
          { licenseNumber: { [Op.iLike]: `%${searchKey}%` } },
          { phoneNumber: { [Op.iLike]: `%${searchKey}%` } },
          { email: { [Op.iLike]: `%${searchKey}%` } }
        ];
      }

      const { count, rows } = await db.VehicleDriver.findAndCountAll({
        where,
        include: [
          {
            model: db.Vendor,
            as: 'vendor',
            attributes: ['id', 'vendorName', 'vendorCode']
          }
        ],
        offset,
        limit,
        order: [['createdAt', 'DESC']],
        attributes: { exclude: ['aadharNumber', 'bankAccountNumber', 'bankIFSC'] }
      });

      return {
        data: rows,
        pagination: {
          total: count,
          page,
          pages: Math.ceil(count / limit)
        }
      };
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get driver by ID
   */
  async getDriverById(driverId) {
    try {
      const driver = await db.VehicleDriver.findByPk(driverId, {
        include: [
          {
            model: db.Vendor,
            as: 'vendor',
            attributes: ['id', 'vendorName', 'vendorCode', 'contactEmail']
          }
        ]
      });

      if (!driver) {
        throw new AppError('Driver not found', 404);
      }

      return driver;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Update driver details
   */
  async updateDriver(driverId, updateData) {
    try {
      const driver = await db.VehicleDriver.findByPk(driverId);

      if (!driver) {
        throw new AppError('Driver not found', 404);
      }

      // Check license number uniqueness if being updated
      if (updateData.licenseNumber && updateData.licenseNumber !== driver.licenseNumber) {
        const existingDriver = await db.VehicleDriver.findOne({
          where: { licenseNumber: updateData.licenseNumber }
        });

        if (existingDriver) {
          throw new AppError('License number already registered', 409);
        }
      }

      // Check aadhar uniqueness if being updated
      if (updateData.aadharNumber && updateData.aadharNumber !== driver.aadharNumber) {
        const existingAadhar = await db.VehicleDriver.findOne({
          where: { aadharNumber: updateData.aadharNumber }
        });

        if (existingAadhar) {
          throw new AppError('Aadhar number already registered', 409);
        }
      }

      const updated = await driver.update(updateData);
      return updated;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Update driver status
   */
  async updateDriverStatus(driverId, status) {
    try {
      const driver = await db.VehicleDriver.findByPk(driverId);

      if (!driver) {
        throw new AppError('Driver not found', 404);
      }

      if (!['available', 'on-trip', 'on-break', 'inactive'].includes(status)) {
        throw new AppError('Invalid status value', 400);
      }

      driver.status = status;
      await driver.save();
      return driver;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get available drivers for a vendor
   */
  async getAvailableDriversByVendor(vendorId) {
    try {
      const drivers = await db.VehicleDriver.findAll({
        where: {
          vendorId,
          status: 'available',
          isActive: true
        },
        include: [
          {
            model: db.Vendor,
            as: 'vendor',
            attributes: ['vendorName']
          }
        ],
        attributes: { exclude: ['aadharNumber', 'bankAccountNumber', 'bankIFSC'] }
      });

      return drivers;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Check driver license validity
   */
  async checkLicenseValidity(driverId) {
    try {
      const driver = await db.VehicleDriver.findByPk(driverId);

      if (!driver) {
        throw new AppError('Driver not found', 404);
      }

      const today = new Date();
      const licenseExpired = new Date(driver.licenseExpiryDate) <= today;

      return {
        driverId: driver.id,
        driverName: `${driver.firstName} ${driver.lastName}`,
        licenseNumber: driver.licenseNumber,
        licenseExpiryDate: driver.licenseExpiryDate,
        licenseExpired,
        isValidForPickup: !licenseExpired && driver.isActive
      };
    } catch (error) {
      throw error;
    }
  }

  /**
   * Delete driver
   */
  async deleteDriver(driverId) {
    try {
      const driver = await db.VehicleDriver.findByPk(driverId);

      if (!driver) {
        throw new AppError('Driver not found', 404);
      }

      await driver.destroy();
      return { message: 'Driver deleted successfully' };
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get drivers by status for a vendor
   */
  async getDriversByStatus(vendorId, status) {
    try {
      const drivers = await db.VehicleDriver.findAll({
        where: {
          vendorId,
          status,
          isActive: true
        },
        attributes: { exclude: ['aadharNumber', 'bankAccountNumber', 'bankIFSC'] }
      });

      return drivers;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = new DriverService();

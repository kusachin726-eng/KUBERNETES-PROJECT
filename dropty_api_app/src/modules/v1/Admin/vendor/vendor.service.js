const { Op } = require('sequelize');
const db = require('../../../../data-access/sequelize/models');
const AppError = require('../../../../utils/errorHandler/appError');

class VendorService {
  /**
   * Create a new vendor
   */
  async createVendor(vendorData) {
    try {
      // Check if vendor code already exists
      const existingVendor = await db.Vendor.findOne({
        where: {
          [Op.or]: [
            { vendorCode: vendorData.vendorCode },
            { contactEmail: vendorData.contactEmail },
            { contactPhone: vendorData.contactPhone }
          ]
        }
      });

      if (existingVendor) {
        throw new AppError('Vendor with this code, email, or phone already exists', 409);
      }

      const vendor = await db.Vendor.create(vendorData);
      return vendor;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get all vendors with pagination and filters
   */
  async getAllVendors(options = {}) {
    try {
      const { page = 1, limit = 10, status, searchKey } = options;
      const offset = (page - 1) * limit;

      const where = {};
      if (status !== undefined) {
        where.isActive = status === 'active';
      }

      if (searchKey) {
        where[Op.or] = [
          { vendorName: { [Op.iLike]: `%${searchKey}%` } },
          { vendorCode: { [Op.iLike]: `%${searchKey}%` } },
          { contactEmail: { [Op.iLike]: `%${searchKey}%` } },
          { contactPhone: { [Op.iLike]: `%${searchKey}%` } }
        ];
      }

      const { count, rows } = await db.Vendor.findAndCountAll({
        where,
        include: [
          {
            model: db.Vehicle,
            as: 'vehicles',
            attributes: ['id', 'vehicleRegistrationNumber', 'status'],
            separate: true
          },
          {
            model: db.VehicleDriver,
            as: 'drivers',
            attributes: ['id', 'firstName', 'lastName', 'status'],
            separate: true
          }
        ],
        offset,
        limit,
        order: [['createdAt', 'DESC']]
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
   * Get single vendor by ID
   */
  async getVendorById(vendorId) {
    try {
      const vendor = await db.Vendor.findByPk(vendorId, {
        include: [
          {
            model: db.Vehicle,
            as: 'vehicles',
            attributes: { exclude: ['deletedAt'] }
          },
          {
            model: db.VehicleDriver,
            as: 'drivers',
            attributes: { exclude: ['deletedAt'] }
          }
        ]
      });

      if (!vendor) {
        throw new AppError('Vendor not found', 404);
      }

      return vendor;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Update vendor details
   */
  async updateVendor(vendorId, updateData) {
    try {
      const vendor = await db.Vendor.findByPk(vendorId);

      if (!vendor) {
        throw new AppError('Vendor not found', 404);
      }

      // Check if updating vendor code and it's not unique
      if (updateData.vendorCode && updateData.vendorCode !== vendor.vendorCode) {
        const existingVendor = await db.Vendor.findOne({
          where: { vendorCode: updateData.vendorCode }
        });

        if (existingVendor) {
          throw new AppError('Vendor code already exists', 409);
        }
      }

      const updated = await vendor.update(updateData);
      return updated;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Toggle vendor active status
   */
  async toggleVendorStatus(vendorId) {
    try {
      const vendor = await db.Vendor.findByPk(vendorId);

      if (!vendor) {
        throw new AppError('Vendor not found', 404);
      }

      vendor.isActive = !vendor.isActive;
      await vendor.save();
      return vendor;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Delete vendor (soft delete if using paranoid)
   */
  async deleteVendor(vendorId) {
    try {
      const vendor = await db.Vendor.findByPk(vendorId);

      if (!vendor) {
        throw new AppError('Vendor not found', 404);
      }

      await vendor.destroy();
      return { message: 'Vendor deleted successfully' };
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get vendor summary stats
   */
  async getVendorStats(vendorId) {
    try {
      const vendor = await db.Vendor.findByPk(vendorId);

      if (!vendor) {
        throw new AppError('Vendor not found', 404);
      }

      const vehicleCount = await db.Vehicle.count({
        where: { vendorId, isActive: true }
      });

      const driverCount = await db.VehicleDriver.count({
        where: { vendorId, isActive: true }
      });

      const availableVehicles = await db.Vehicle.count({
        where: { vendorId, status: 'available', isActive: true }
      });

      const availableDrivers = await db.VehicleDriver.count({
        where: { vendorId, status: 'available', isActive: true }
      });

      const totalBookings = await db.BookingLogistics.count({
        where: { vendorId }
      });

      return {
        vendorName: vendor.vendorName,
        totalVehicles: vehicleCount,
        availableVehicles,
        totalDrivers: driverCount,
        availableDrivers,
        totalBookings,
        commissionPercentage: vendor.estimatedCommissionPercentage
      };
    } catch (error) {
      throw error;
    }
  }
}

module.exports = new VendorService();

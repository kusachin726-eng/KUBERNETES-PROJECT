const { Op } = require('sequelize');
const db = require('../../../../data-access/sequelize/models');
const AppError = require('../../../../utils/errorHandler/appError');

class VehicleService {
  /**
   * Create a new vehicle
   */
  async createVehicle(vehicleData) {
    try {
      // Verify vendor exists
      const vendor = await db.Vendor.findByPk(vehicleData.vendorId);
      if (!vendor) {
        throw new AppError('Vendor not found', 404);
      }

      // Check if registration number is unique
      const existingVehicle = await db.Vehicle.findOne({
        where: { vehicleRegistrationNumber: vehicleData.vehicleRegistrationNumber }
      });

      if (existingVehicle) {
        throw new AppError('Vehicle registration number already exists', 409);
      }

      const vehicle = await db.Vehicle.create(vehicleData);
      return vehicle;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get all vehicles with filters
   */
  async getAllVehicles(options = {}) {
    try {
      const { page = 1, limit = 10, vendorId, status, searchKey } = options;
      const offset = (page - 1) * limit;

      const where = {};
      if (vendorId) where.vendorId = vendorId;
      if (status) where.status = status;

      if (searchKey) {
        where[Op.or] = [
          { vehicleRegistrationNumber: { [Op.iLike]: `%${searchKey}%` } },
          { vehicleModel: { [Op.iLike]: `%${searchKey}%` } }
        ];
      }

      const { count, rows } = await db.Vehicle.findAndCountAll({
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
   * Get vehicle by ID
   */
  async getVehicleById(vehicleId) {
    try {
      const vehicle = await db.Vehicle.findByPk(vehicleId, {
        include: [
          {
            model: db.Vendor,
            as: 'vendor',
            attributes: ['id', 'vendorName', 'vendorCode', 'contactEmail', 'contactPhone']
          }
        ]
      });

      if (!vehicle) {
        throw new AppError('Vehicle not found', 404);
      }

      return vehicle;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Update vehicle details
   */
  async updateVehicle(vehicleId, updateData) {
    try {
      const vehicle = await db.Vehicle.findByPk(vehicleId);

      if (!vehicle) {
        throw new AppError('Vehicle not found', 404);
      }

      // Check registration number uniqueness if being updated
      if (
        updateData.vehicleRegistrationNumber &&
        updateData.vehicleRegistrationNumber !== vehicle.vehicleRegistrationNumber
      ) {
        const existingVehicle = await db.Vehicle.findOne({
          where: { vehicleRegistrationNumber: updateData.vehicleRegistrationNumber }
        });

        if (existingVehicle) {
          throw new AppError('Vehicle registration number already exists', 409);
        }
      }

      const updated = await vehicle.update(updateData);
      return updated;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Update vehicle status
   */
  async updateVehicleStatus(vehicleId, status) {
    try {
      const vehicle = await db.Vehicle.findByPk(vehicleId);

      if (!vehicle) {
        throw new AppError('Vehicle not found', 404);
      }

      if (!['available', 'booked', 'maintenance', 'inactive'].includes(status)) {
        throw new AppError('Invalid status value', 400);
      }

      vehicle.status = status;
      await vehicle.save();
      return vehicle;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get available vehicles for a vendor
   */
  async getAvailableVehiclesByVendor(vendorId) {
    try {
      const vehicles = await db.Vehicle.findAll({
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
        ]
      });

      return vehicles;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get vehicles by status for a vendor
   */
  async getVehiclesByStatus(vendorId, status) {
    try {
      const vehicles = await db.Vehicle.findAll({
        where: {
          vendorId,
          status,
          isActive: true
        }
      });

      return vehicles;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Delete vehicle
   */
  async deleteVehicle(vehicleId) {
    try {
      const vehicle = await db.Vehicle.findByPk(vehicleId);

      if (!vehicle) {
        throw new AppError('Vehicle not found', 404);
      }

      await vehicle.destroy();
      return { message: 'Vehicle deleted successfully' };
    } catch (error) {
      throw error;
    }
  }

  /**
   * Check vehicle maintenance status
   */
  async checkMaintenanceStatus(vehicleId) {
    try {
      const vehicle = await db.Vehicle.findByPk(vehicleId);

      if (!vehicle) {
        throw new AppError('Vehicle not found', 404);
      }

      const today = new Date();
      const maintenanceDue = vehicle.nextMaintenanceDueDate ? new Date(vehicle.nextMaintenanceDueDate) <= today : false;
      const insuranceExpired = vehicle.insuranceExpiryDate ? new Date(vehicle.insuranceExpiryDate) <= today : false;
      const pollutionExpired = vehicle.pollutionCertificateExpiryDate 
        ? new Date(vehicle.pollutionCertificateExpiryDate) <= today 
        : false;

      return {
        vehicleId: vehicle.id,
        registrationNumber: vehicle.vehicleRegistrationNumber,
        maintenanceDue,
        insuranceExpired,
        pollutionCertificateExpired: pollutionExpired,
        isReadyForPickup: !maintenanceDue && !insuranceExpired && !pollutionExpired && vehicle.isActive
      };
    } catch (error) {
      throw error;
    }
  }
}

module.exports = new VehicleService();

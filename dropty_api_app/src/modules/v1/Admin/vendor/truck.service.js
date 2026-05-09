const { Op } = require('sequelize');
const db = require('../../../../data-access/sequelize/models');
const AppError = require('../../../../utils/errorHandler/appError');

class TruckService {
  /**
   * Create a new truck
   */
  async createTruck(truckData) {
    try {
      // Verify vendor exists
      const vendor = await db.Vendor.findByPk(truckData.vendorId);
      if (!vendor) {
        throw new AppError('Vendor not found', 404);
      }

      // Check if registration number is unique
      const existingTruck = await db.Truck.findOne({
        where: { truckRegistrationNumber: truckData.truckRegistrationNumber }
      });

      if (existingTruck) {
        throw new AppError('Truck registration number already exists', 409);
      }

      const truck = await db.Truck.create(truckData);
      return truck;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get all trucks with filters
   */
  async getAllTrucks(options = {}) {
    try {
      const { page = 1, limit = 10, vendorId, status, searchKey } = options;
      const offset = (page - 1) * limit;

      const where = {};
      if (vendorId) where.vendorId = vendorId;
      if (status) where.status = status;

      if (searchKey) {
        where[Op.or] = [
          { truckRegistrationNumber: { [Op.iLike]: `%${searchKey}%` } },
          { truckModel: { [Op.iLike]: `%${searchKey}%` } }
        ];
      }

      const { count, rows } = await db.Truck.findAndCountAll({
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
   * Get truck by ID
   */
  async getTruckById(truckId) {
    try {
      const truck = await db.Truck.findByPk(truckId, {
        include: [
          {
            model: db.Vendor,
            as: 'vendor',
            attributes: ['id', 'vendorName', 'vendorCode', 'contactEmail', 'contactPhone']
          }
        ]
      });

      if (!truck) {
        throw new AppError('Truck not found', 404);
      }

      return truck;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Update truck details
   */
  async updateTruck(truckId, updateData) {
    try {
      const truck = await db.Truck.findByPk(truckId);

      if (!truck) {
        throw new AppError('Truck not found', 404);
      }

      // Check registration number uniqueness if being updated
      if (
        updateData.truckRegistrationNumber &&
        updateData.truckRegistrationNumber !== truck.truckRegistrationNumber
      ) {
        const existingTruck = await db.Truck.findOne({
          where: { truckRegistrationNumber: updateData.truckRegistrationNumber }
        });

        if (existingTruck) {
          throw new AppError('Truck registration number already exists', 409);
        }
      }

      const updated = await truck.update(updateData);
      return updated;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Update truck status
   */
  async updateTruckStatus(truckId, status) {
    try {
      const truck = await db.Truck.findByPk(truckId);

      if (!truck) {
        throw new AppError('Truck not found', 404);
      }

      if (!['available', 'booked', 'maintenance', 'inactive'].includes(status)) {
        throw new AppError('Invalid status value', 400);
      }

      truck.status = status;
      await truck.save();
      return truck;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get available trucks for a vendor
   */
  async getAvailableTrucksByVendor(vendorId) {
    try {
      const trucks = await db.Truck.findAll({
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

      return trucks;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get trucks by status for a vendor
   */
  async getTrucksByStatus(vendorId, status) {
    try {
      const trucks = await db.Truck.findAll({
        where: {
          vendorId,
          status,
          isActive: true
        }
      });

      return trucks;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Delete truck
   */
  async deleteTruck(truckId) {
    try {
      const truck = await db.Truck.findByPk(truckId);

      if (!truck) {
        throw new AppError('Truck not found', 404);
      }

      await truck.destroy();
      return { message: 'Truck deleted successfully' };
    } catch (error) {
      throw error;
    }
  }

  /**
   * Check truck maintenance status
   */
  async checkMaintenanceStatus(truckId) {
    try {
      const truck = await db.Truck.findByPk(truckId);

      if (!truck) {
        throw new AppError('Truck not found', 404);
      }

      const today = new Date();
      const maintenanceDue = truck.nextMaintenanceDueDate ? new Date(truck.nextMaintenanceDueDate) <= today : false;
      const insuranceExpired = truck.insuranceExpiryDate ? new Date(truck.insuranceExpiryDate) <= today : false;
      const pollutionExpired = truck.pollutionCertificateExpiryDate 
        ? new Date(truck.pollutionCertificateExpiryDate) <= today 
        : false;

      return {
        truckId: truck.id,
        registrationNumber: truck.truckRegistrationNumber,
        maintenancesDue,
        insuranceExpired,
        pollutionCertificateExpired: pollutionExpired,
        isReadyForPickup: !maintenanceDue && !insuranceExpired && !pollutionExpired && truck.isActive
      };
    } catch (error) {
      throw error;
    }
  }
}

module.exports = new TruckService();

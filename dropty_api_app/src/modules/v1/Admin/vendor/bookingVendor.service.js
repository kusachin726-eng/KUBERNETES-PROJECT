const db = require('../../../../data-access/sequelize/models');
const AppError = require('../../../../utils/errorHandler/appError');

class BookingVendorService {
  /**
   * Assign vendor vehicle and driver to a booking
   */
  async assignVendorToBooking(bookingId, assignmentData) {
    try {
      const { vendorId, vehicleId, driverId } = assignmentData;

      // Verify booking exists
      const booking = await db.Bookings.findByPk(bookingId, {
        include: [
          {
            model: db.BookingLogistics,
            as: 'logistics'
          }
        ]
      });

      if (!booking || !booking.logistics) {
        throw new AppError('Booking or booking logistics not found', 404);
      }

      // Verify vendor exists and is active
      const vendor = await db.Vendor.findByPk(vendorId);
      if (!vendor || !vendor.isActive) {
        throw new AppError('Vendor not found or inactive', 404);
      }

      // Verify vehicle exists, belongs to vendor, and is available
      const vehicle = await db.Vehicle.findOne({
        where: {
          id: vehicleId,
          vendorId: vendorId,
          isActive: true
        }
      });

      if (!vehicle) {
        throw new AppError('Vehicle not found, inactive, or does not belong to vendor', 404);
      }

      if (vehicle.status !== 'available') {
        throw new AppError(`Vehicle is currently ${vehicle.status}`, 400);
      }

      // Verify driver exists, belongs to vendor, and is available
      const driver = await db.VehicleDriver.findOne({
        where: {
          id: driverId,
          vendorId: vendorId,
          isActive: true
        }
      });

      if (!driver) {
        throw new AppError('Driver not found, inactive, or does not belong to vendor', 404);
      }

      if (driver.status !== 'available') {
        throw new AppError(`Driver is currently ${driver.status}`, 400);
      }

      // Calculate vendor commission based on booking fare
      let vendorCommissionAmount = 0;
      if (assignmentData.bookingAmount && vendor.estimatedCommissionPercentage) {
        vendorCommissionAmount = 
          (assignmentData.bookingAmount * vendor.estimatedCommissionPercentage) / 100;
      }

      // Update booking logistics with vendor assignment
      const updatedLogistics = await booking.logistics.update({
        vendorId,
        vehicleId,
        driverId,
        vendorCommissionAmount,
        pickupConfirmedByVendor: false,
        vendorConfirmationTime: null
      });

      // Update vehicle and driver status to booked
      await vehicle.update({ status: 'booked' });
      await driver.update({ status: 'on-trip' });

      return updatedLogistics;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Confirm vendor pickup assignment
   */
  async confirmPickupAssignment(bookingId) {
    try {
      const booking = await db.Bookings.findByPk(bookingId, {
        include: [
          {
            model: db.BookingLogistics,
            as: 'logistics'
          }
        ]
      });

      if (!booking || !booking.logistics) {
        throw new AppError('Booking or booking logistics not found', 404);
      }

      if (!booking.logistics.vendorId) {
        throw new AppError('No vendor assigned to this booking', 400);
      }

      const updatedLogistics = await booking.logistics.update({
        pickupConfirmedByVendor: true,
        vendorConfirmationTime: new Date()
      });

      return updatedLogistics;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Unassign vendor from booking (cancel assignment)
   */
  async unassignVendor(bookingId) {
    try {
      const booking = await db.Bookings.findByPk(bookingId, {
        include: [
          {
            model: db.BookingLogistics,
            as: 'logistics',
            include: [
              { model: db.Vehicle, as: 'vehicle' },
              { model: db.VehicleDriver, as: 'driver' }
            ]
          }
        ]
      });

      if (!booking || !booking.logistics) {
        throw new AppError('Booking or booking logistics not found', 404);
      }

      if (!booking.logistics.vendorId) {
        throw new AppError('No vendor currently assigned to this booking', 400);
      }

      // Revert vehicle status back to available
      if (booking.logistics.vehicle) {
        await booking.logistics.vehicle.update({ status: 'available' });
      }

      // Revert driver status back to available
      if (booking.logistics.driver) {
        await booking.logistics.driver.update({ status: 'available' });
      }

      // Remove vendor assignment
      const updatedLogistics = await booking.logistics.update({
        vendorId: null,
        vehicleId: null,
        driverId: null,
        vendorCommissionAmount: 0.00,
        pickupConfirmedByVendor: false,
        vendorConfirmationTime: null
      });

      return updatedLogistics;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get booking details with vendor and truck info
   */
  async getBookingWithVendorDetails(bookingId) {
    try {
      const booking = await db.Bookings.findByPk(bookingId, {
        include: [
          {
            model: db.BookingLogistics,
            as: 'logistics',
            include: [
              {
                model: db.Vendor,
                as: 'vendor',
                attributes: ['id', 'vendorName', 'vendorCode', 'contactEmail', 'contactPhone']
              },
              {
                model: db.Vehicle,
                as: 'vehicle',
                attributes: ['id', 'vehicleRegistrationNumber', 'vehicleModel', 'capacityKg', 'capacityVolumeCubicMeter']
              },
              {
                model: db.VehicleDriver,
                as: 'driver',
                attributes: ['id', 'firstName', 'lastName', 'phoneNumber', 'licenseNumber']
              }
            ]
          },
          {
            model: db.BookingAddress,
            as: 'address'
          }
        ]
      });

      if (!booking) {
        throw new AppError('Booking not found', 404);
      }

      return booking;
    } catch (error) {
      throw error;
    }
  }

 
}

module.exports = new BookingVendorService();

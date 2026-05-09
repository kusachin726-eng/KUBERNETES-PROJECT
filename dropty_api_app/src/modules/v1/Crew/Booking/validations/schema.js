const Joi = require("@hapi/joi");

const schema = {
  pnrDetailsSchema: Joi.object({
    pnr: Joi.string().alphanum().length(6).required(),
    airlineId: Joi.number().integer().required(),
    emailOrLastName: Joi.string().min(2).required(), // optional: enforce length
  }),

  bookingSchema: Joi.object({
    pnr: Joi.string().alphanum().length(6).required(),
    airlineId: Joi.number().integer().required(),
    emailOrLastName: Joi.string().min(2).required(),

    // Flight Details
    flightType: Joi.string().valid('domestic', 'international').required(),
    flightNumber: Joi.string().required(),
    airportCode: Joi.string().length(3).uppercase().required(),
    airportName: Joi.string().required(),
    city: Joi.string().required(),
    terminal: Joi.string().required(),
    date: Joi.string().isoDate().required(),
    time: Joi.string().pattern(/^([01]\d|2[0-3]):([0-5]\d)$/).required(), // HH:MM 24-hour format          

    passengers: Joi.array().items(
      Joi.object({
        title: Joi.string().valid('Mr', 'Mrs', 'Miss', 'Ms', 'Master').required(),
        firstName: Joi.string().required(),
        lastName: Joi.string().required(),
        passengerType: Joi.string().valid('ADULT', 'CHILD', 'INFANT').required(),
        baggage: Joi.object({
          allowedBaggageWeightKg: Joi.number().precision(2).required(),
          excessBaggageWeightKg: Joi.number().precision(2).allow(null, ""),
          allowedBagCount: Joi.number().required(),
          excessBagCount: Joi.number().allow(null, ""),
          selectedExtraBaggageFareId: Joi.array().items(Joi.number().integer()).allow(null, "")
        }).required()
      })
    ).min(1).required()
  }),

  bookingAddressSchema: Joi.object({
    bookingId: Joi.number().integer().positive().required(),
    lead_passenger_name: Joi.string().trim().min(2).max(100).required(),
    mobile: Joi.string().pattern(/^[6-9]\d{9}$/).required().messages({'string.pattern.base': 'Mobile number must be a valid 10-digit Indian number'}),
    alternate_mobile: Joi.string().pattern(/^[6-9]\d{9}$/).optional().allow(null),
    flat_house_number: Joi.string().trim().max(100).required(),
    street_building: Joi.string().trim().max(150).required(),
    landmark: Joi.string().trim().max(150).optional().allow(null),
    city: Joi.string().trim().max(50).required(),
    state: Joi.string().trim().max(50).required(),
    pincode: Joi.string().pattern(/^\d{6}$/).required().messages({'string.pattern.base': 'Pincode must be a valid 6-digit number'}),
    address: Joi.string().trim().max(500).required(),
    totalDistanceKm: Joi.number().precision(2).min(0).default(0),    
    latitude: Joi.string().required(),
    longitude: Joi.string().required(),
    addressType: Joi.string().valid('Home', 'Office', 'Other').allow(null, ""),
    addressTypeOther: Joi.string().when('addressType', {
      is: 'Other',
      then: Joi.string().trim().max(50).required(),
      otherwise: Joi.string().optional().allow(null, "")
    })   
  }),

  timeSlotValidationSchema: Joi.object({
    bookingId: Joi.number().integer().positive().required()
  }),

  confirmBookingValidationSchema: Joi.object({
    bookingId: Joi.number().integer().positive().required(),
    pickupDate: Joi.string().isoDate().required(),
    pickupStartTime: Joi.string().pattern(/^([01]\d|2[0-3]):([0-5]\d)$/).required(), // HH:MM 24-hour format
    pickupEndTime: Joi.string().pattern(/^([01]\d|2[0-3]):([0-5]\d)$/).required() // HH:MM 24-hour format
  }),

  confirmBookingValidSchema: Joi.object({
    bookingId: Joi.number().integer().positive().required(),
  })

};

module.exports = schema;
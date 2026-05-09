const Joi = require('@hapi/joi');

const damageBaggageReportSchema = {
  createDamageReport: Joi.object({
    damageType: Joi.string().valid('baggage', 'other').default('baggage'),
    baggageDescription: Joi.string().optional(),
    damageDescription: Joi.string().required(),
    severity: Joi.string().valid('minor', 'moderate', 'major').required(),
    message: Joi.string().optional(),
    images: Joi.array().items(Joi.string()).optional()
  }),

  replyToDamageReport: Joi.object({
    replyMessage: Joi.string().required(),
    images: Joi.array().items(Joi.string()).optional()
  }),

  updateDamageReportStatus: Joi.object({
    status: Joi.string().valid('reported', 'under-review', 'resolved', 'rejected').required()
  }),

  listDamageReports: Joi.object({
    page: Joi.number().optional(),
    limit: Joi.number().optional(),
    status: Joi.string().valid('reported', 'under-review', 'resolved', 'rejected').optional(),
    severity: Joi.string().valid('minor', 'moderate', 'major').optional(),
    searchKey: Joi.string().optional()
  }),

  damageReportIdParam: Joi.object({
    reportId: Joi.number().required()
  }),

  bookingIdParam: Joi.object({
    bookingId: Joi.number().required()
  })
};

module.exports = damageBaggageReportSchema;

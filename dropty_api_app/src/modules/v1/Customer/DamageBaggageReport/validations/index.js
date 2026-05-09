const validate = require("../../../../../middleware/validator");
const { createDamageReport, replyToDamageReport, updateDamageReportStatus, listDamageReports, damageReportIdParam, bookingIdParam } = require("./schema");

module.exports = {
  createDamageReport: validate({ body: createDamageReport }),
  replyToDamageReport: validate({ body: replyToDamageReport, params: damageReportIdParam }),
  updateDamageReportStatus: validate({ body: updateDamageReportStatus, params: damageReportIdParam }),
  listDamageReports: validate({ query: listDamageReports, params: bookingIdParam }),
  damageReportIdParam: validate({ params: damageReportIdParam }),
  bookingIdParam: validate({ params: bookingIdParam })
};

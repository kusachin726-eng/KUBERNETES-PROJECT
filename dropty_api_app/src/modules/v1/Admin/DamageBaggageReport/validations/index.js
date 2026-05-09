const validate = require("../../../../../middleware/validator");
const { replyToDamageReport, updateDamageReportStatus, listDamageReports, damageReportIdParam, bookingIdParam} = require("./schema");

module.exports = {  
  replyToDamageReport: validate({ body: replyToDamageReport, params: damageReportIdParam }),
  updateDamageReportStatus: validate({ body: updateDamageReportStatus, params: damageReportIdParam }),
  listDamageReports: validate({ query: listDamageReports, params: bookingIdParam }),
  damageReportIdParam: validate({ params: damageReportIdParam })
};

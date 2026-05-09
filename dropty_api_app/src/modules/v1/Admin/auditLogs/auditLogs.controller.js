const auditLogsService = require("./auditLogs.service");


class AuditLogsController{
    async getAuditLogs(req, res) {
    const { limit = 10, page = 1, sortBy, sortOrder, ...filters } = req.query;


    const offset = (page - 1) * limit;


    const result = await auditLogsService.getAllAuditLogs(
      filters, limit, offset, { sortBy, sortOrder }
    );


    res.status(200).json({
      success: true,
      data: result
    });
}


}


module.exports = new AuditLogsController()
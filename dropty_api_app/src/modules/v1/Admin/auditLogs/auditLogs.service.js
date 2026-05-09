const { Op, fn, where, col } = require("sequelize");
const db = require("../../../../data-access/sequelize/models");
const formatDateTime = require("../../../../utils/dateUtils");


class AuditLogsServices {


    async getAllAuditLogs(filters, limit, offset, sortOptions) {
        try {
            const whereClause = {};


            const allowedFilters = ["userId", "action", "tableName"];
            allowedFilters.forEach((key) => {
                if (filters[key]) {
                    whereClause[key] = key === "userId"? filters[key]: { [Op.iLike]: `%${filters[key]}%` };
                }
            });


            if (filters.searchKey) {
                const normalizedSearchKey = filters.searchKey.toLowerCase().trim();


                whereClause[Op.or] = [
                    { "$user.userProfile.firstName$": { [Op.iLike]: `%${filters.searchKey}%` } },
                    { "$user.userProfile.lastName$": { [Op.iLike]: `%${filters.searchKey}%` } },
                    where(
                        fn(
                            "concat",
                            col("user.userProfile.firstName"),
                            " ",
                            col("user.userProfile.lastName")
                        ),
                        { [Op.iLike]: `%${normalizedSearchKey}%` }
                    ),
                    { "$user.email$": { [Op.iLike]: `%${filters.searchKey}%` } },
                    { "$user.mobile_number$": { [Op.iLike]: `%${filters.searchKey}%` } }
                   
                ];
            }


            const result = await db.AuditLog.findAndCountAll({
                where: whereClause,
                include: [
                    {
                        model: db.Users,
                        as: "user",
                        attributes: ["id", "email", "mobile_number"],
                        include: [
                            {
                                model: db.UserProfile,
                                as: "userProfile",
                                attributes: ["firstName", "lastName"]
                            }
                        ]
                    }
                ],
                limit: Number(limit),
                offset: Number(offset),
                order: [[sortOptions.sortBy || "createdAt", sortOptions.sortOrder || "DESC"]],
            });


            result.rows = result.rows.map(auditlog => {
                const plain = auditlog.get({ plain: true });
                return {
                    ...plain,
                    createdAt: formatDateTime(plain.createdAt),
                    updatedAt: formatDateTime(plain.updatedAt),
                };
            });


            return {
                totalCount: result.count,
                page: Math.ceil(offset / limit) + 1,
                totalPages: Math.ceil(result.count / limit),
                limit: Number(limit),
                rows: result.rows
            };


        } catch (error) {
            throw new Error(`Failed to fetch audit logs: ${error.message}`);
        }
    }
}


module.exports = new AuditLogsServices();
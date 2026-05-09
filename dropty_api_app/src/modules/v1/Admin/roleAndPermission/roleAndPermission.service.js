const { Op, where } = require("sequelize");
const db = require("../../../../data-access/sequelize/models");
const AppError = require("../../../../utils/errorHandler/appError");

class RoleAndPermissionServices {
    async getAdminList(filters, limit, offset, sortOptions) {

        try {
            const whereClause = {
                user_type: 'admin',
            };

            if (filters.searchKey) {
                whereClause[Op.or] = [
                    { '$userProfile.firstName$': { [Op.iLike]: `%${filters.searchKey}%` } },
                    { '$userProfile.lastName$': { [Op.iLike]: `%${filters.searchKey}%` } },
                    { email: { [Op.iLike]: `%${filters.searchKey}%` } },
                    { mobile_number: { [Op.iLike]: `%${filters.searchKey}%` } },
                    { '$adminRole.title$': { [Op.iLike]: `%${filters.searchKey}%` } },
                ];
            }

            if (filters.isActive !== undefined) {
                whereClause.isActive = filters.isActive === 'true' || filters.isActive === true;
            }

            return await db.Users.findAndCountAll({
                include: [
                    {
                        model: db.UserProfile,
                        as: "userProfile",
                        attributes: ['firstName', 'lastName', 'avatarUrl'],
                    },
                    {
                        model: db.AdminRoles,
                        as: "adminRole",
                        attributes: ['id', 'title'],
                    }
                ],
                attributes: ['id', 'mobile_number', 'email', 'isActive', 'createdAt'],
                where: whereClause,
                limit: Number(limit),
                offset: Number(offset),
                order: [[sortOptions.sortBy, sortOptions.sortOrder]],
            });
        } catch (error) {
            throw error;
        }
    }

    async isUserExist(conditions) {
        try {
            return await db.Users.findOne({
                where: conditions,
            });
        } catch (error) {
            throw error;
        }
    }

    async getFeaturesList(searchKey, limit, offset) {
        try {
            const whereCondition = {
            };

            if (searchKey) {
                whereCondition[Op.or] = [
                    { title: { [Op.iLike]: `%${searchKey}%` } }
                ];
            }

            return await db.AdminRoleFeatures.findAndCountAll({
                where: whereCondition,
                limit: limit,
                offset: offset,
                order: [['createdAt', 'DESC']],
            });
        } catch (error) {
            throw error;
        }
    }

    async createFeature(title) {
        try {
            const newFeature = await db.AdminRoleFeatures.create({ title });
            return {
                featureId: newFeature.id,
                featureTitle: newFeature.title,
                isActive: newFeature.isActive,
                createdAt: newFeature.createdAt,
            };
        } catch (error) {
            throw error;
        }
    }

    async getFeatureById(featureId) {
        try {
            return await db.AdminRoleFeatures.findOne({
                where: { id: featureId },
                attributes: ['id', 'title', 'isActive', 'createdAt'],
            })
        } catch (error) {
            throw error;
        }
    }

    async updateFeature(featureId, title, isActive) {
        try {
            const feature = await this.getFeatureById(featureId);
            if (!feature) {
                throw new AppError('Feature not found', 404);
            }
            if (title) {
                const existingFeature = await db.AdminRoleFeatures.findOne({
                    where: {
                        title,
                        id: { [Op.ne]: featureId },
                    },
                });
                if (existingFeature) {
                    throw new AppError('Feature title already exists', 400);
                }
            }           

            feature.title = title !== undefined ? title : feature.title;
            feature.isActive = isActive !== undefined ? isActive : feature.isActive;

            await feature.save();

            return {
                featureId: feature.id,
                featureTitle: feature.title,
                isActive: feature.isActive,
                createdAt: feature.createdAt,
            };
        } catch (error) {
            throw error;
        }
    }

    async getRoleList(searchKey, limit, offset) {
        try {
            const whereCondition = {
                isActive: true,
            };

            if (searchKey) {
                whereCondition[Op.or] = [
                    { title: { [Op.iLike]: `%${searchKey}%` } }
                ];
            }

            const [features, rolesResult] = await Promise.all([
                db.AdminRoleFeatures.findAll({
                    where: { isActive: true },
                    attributes: ['id', 'title'],
                    order: [['createdAt', 'DESC']],
                }),
                db.AdminRoles.findAndCountAll({
                    distinct: true,
                    where: whereCondition,
                    attributes: ['id', 'title', 'isActive', 'createdAt'],
                    include: [
                        {
                            model: db.AdminPermissions,
                            as: 'permissions',
                            attributes: ['id', 'featureId', 'canView', 'canCreate', 'canEdit', 'canDelete'],
                            required: false,
                            include: [
                                {
                                    model: db.AdminRoleFeatures,
                                    as: 'feature',
                                    attributes: ['id', 'title'],
                                    where: { isActive: true },
                                    required: false,
                                }
                            ]
                        }
                    ],
                    limit: Number(limit),
                    offset: Number(offset),
                    order: [['createdAt', 'DESC']],
                })
            ]);

            const featureList = features.map((feature) => feature.get({ plain: true }));

            const rows = rolesResult.rows.map((role) => {
                const plainRole = role.get({ plain: true });

                const existingByFeatureId = new Map();
                for (const permission of (plainRole.permissions || [])) {
                    const featureId = permission?.feature?.id ?? permission?.featureId;
                    if (featureId != null) {
                        existingByFeatureId.set(featureId, permission);
                    }
                }

                return {
                    roleId: plainRole.id,
                    roleTitle: plainRole.title,
                    isActive: plainRole.isActive,
                    createdAt: plainRole.createdAt,
                    permissions: featureList.map((feature) => {
                        const existingPermission = existingByFeatureId.get(feature.id);
                        return {
                            permissionId: existingPermission?.id ?? null,
                            featureId: feature.id,
                            featureTitle: feature.title,
                            canView: Boolean(existingPermission?.canView),
                            canCreate: Boolean(existingPermission?.canCreate),
                            canEdit: Boolean(existingPermission?.canEdit),
                            canDelete: Boolean(existingPermission?.canDelete),
                        };
                    }),
                };
            });

            return {
                count: rolesResult.count,
                rows,
            };
        } catch (error) {
            throw error;
        }
    }

    async createRole(title) {
        try {
            const newRole = await db.AdminRoles.create({ title });
            return {
                roleId: newRole.id,
                roleTitle: newRole.title,
                isActive: newRole.isActive,
                createdAt: newRole.createdAt,
            };
        } catch (error) {
            throw error;
        }
    }

    async getRoleById(roleId) {
        try {
            return await db.AdminRoles.findOne({
                where: { id: roleId },
                attributes: ['id', 'title', 'isActive', 'createdAt'],
            })
        } catch (error) {
            throw error;
        }
    }

    async updateRole(roleId, title, isActive) {
        try {
            const role = await this.getRoleById(roleId);
            if (!role) {
                throw new Error('Role not found');
            }

            role.title = title !== undefined ? title : role.title;
            role.isActive = isActive !== undefined ? isActive : role.isActive;

            await role.save();

            return {
                roleId: role.id,
                roleTitle: role.title,
                isActive: role.isActive,
                createdAt: role.createdAt,
            };
        } catch (error) {
            throw error;
        }
    }
    async updatePermissionRoleFeatures(roleId, permissionData) {
        const transaction = await db.sequelize.transaction();

        try {
            for (const p of permissionData) {
                const hasAnyPermission = p.canView || p.canCreate || p.canEdit || p.canDelete;

                if (!hasAnyPermission) {
                    await db.AdminPermissions.destroy({
                        where: {
                            roleId,
                            featureId: p.featureId,
                        },
                        transaction,
                    });
                    continue;
                }
                // check
                const [permission, created] = await db.AdminPermissions.findOrCreate({
                    where: {
                        roleId,
                        featureId: p.featureId,
                    },
                    defaults: {
                        canView: p.canView,
                        canCreate: p.canCreate,
                        canEdit: p.canEdit,
                        canDelete: p.canDelete,
                    },
                    transaction,
                });

                if (!created) {
                    permission.canView = p.canView;
                    permission.canCreate = p.canCreate;
                    permission.canEdit = p.canEdit;
                    permission.canDelete = p.canDelete;

                    await permission.save({ transaction });
                }
            }  
            await transaction.commit();
            return true;
        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    }

}

module.exports = new RoleAndPermissionServices();
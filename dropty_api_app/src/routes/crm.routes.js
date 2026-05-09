const express = require('express');
const router = express.Router();

/**
 * CRM Routes (Admin Routes)
 * Routes for admin/CRM functionality
 */
router.use('/admin/users', require('../modules/v1/Admin/users/user.routes'));
router.use('/admin/auth', require('../modules/v1/Admin/auth/auth.index'));
router.use('/admin/customer', require('../modules/v1/Admin/customer/customer.index'));
router.use('/admin/cities', require('../modules/v1/Admin/cities/cities.index'));
router.use('/admin/staff', require('../modules/v1/Admin/staff/staff.index'));
router.use('/admin/crew', require('../modules/v1/Admin/crew/crew.index'));
router.use('/admin/roleAndPermission', require('../modules/v1/Admin/roleAndPermission/roleAndPermission.index'));
router.use('/admin/settings', require('../modules/v1/Admin/settings/settings.index'));
router.use('/admin/booking', require('../modules/v1/Admin/booking/booking.routes'));
router.use('/admin/airlines', require('../modules/v1/Admin/airlines/airline.index'));
router.use('/admin/auditLogs', require('../modules/v1/Admin/auditLogs/auditLogs.index'));
router.use('/admin/notification', require('../modules/v1/Admin/Notification/notification.routes'));
router.use('/admin/vendor', require('../modules/v1/Admin/vendor/vendor.routes'));
router.use('/admin', require('../modules/v1/Customer/DamageBaggageReport/damageReport.routes'));
router.use('/admin/damage-reports', require('../modules/v1/Admin/DamageBaggageReport/damageReport.routes'));

module.exports = router;

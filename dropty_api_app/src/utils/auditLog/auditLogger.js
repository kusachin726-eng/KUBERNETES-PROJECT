const auditRequestContext = require('./auditRequestContext');

const EXCLUDED_FIELDS = [
  'id',
  'user_id',
  'createdAt',
  'updatedAt',
  'deletedAt',
  'device_id',
];
//exclude fields that are not relevant for auditing 
const dataFilter = (data) => {
  if (!data) return null;

  return Object.fromEntries(
    Object.entries(data).filter(
      ([key]) => !EXCLUDED_FIELDS.includes(key)
    )
  );
};
const SENSITIVE_FIELDS = new Set([
  'auth_token',
  'fcm_token',
  'otp'
]);
// Skip audit logging for records containing sensitive fields
const skipAudit = (newData) => {
  if (!newData) return false;

  return Object.keys(newData).some(key =>
    SENSITIVE_FIELDS.has(key)
  );
};

const createAuditLog = async ({
  db,
  action,
  model,
  instance,
  oldData
}) => {
  try {
    const newData = instance?.toJSON() || null;
    if (skipAudit(newData)) {
      return;
    }
// Create audit log entry
    await db.AuditLog.create(
      {
        userId: auditRequestContext.getUserId(),
        action,
        model: model.name,
        tableName: model.getTableName(),
        recordId: instance?.id || null,
        oldData: dataFilter(oldData),
        newData: dataFilter(newData),
        ipAddress: auditRequestContext.getIpAddress(),
        userAgent: auditRequestContext.getUserAgent()
      },
    ); 
  } catch (err) {
    console.error('Audit log failed:', err);
  }
};

module.exports = { createAuditLog };

'use strict';

require("dotenv").config();
const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const process = require('process');
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/config.js')[env];
const { createAuditLog } = require('../../../utils/auditLog/auditLogger');
//console.log(__dirname + '/../config/config.js')
const db = {};

let sequelize;
if (config.use_env_variable) {  
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, config);
}


// Check if the connection is successful
sequelize
  .authenticate()
  .then(() => {
    console.log('Database connection has been established successfully.');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });

  
fs
  .readdirSync(__dirname)
  .filter(file => {
    return (
      file.indexOf('.') !== 0 &&
      file !== basename &&
      file.slice(-3) === '.js' &&
      file.indexOf('.test.js') === -1
    );
  })
  .forEach(file => {
    const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
    db[model.name] = model;
  });

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});
// Audit Logging Hooks
Object.values(db).forEach(model => {
  if (!model || !model.addHook || model.name === 'AuditLog') return;
// Add hooks for create, update, delete operations
  model.addHook('afterCreate', async (instance, options) => {
    if (options.skipAudit) return;

    await createAuditLog({
      db,
      action: 'CREATE',
      model,
      instance,
      oldData: null
    });
  });

  model.addHook('beforeUpdate', (instance, options) => {
    options._oldData = { ...instance._previousDataValues };
  });

  model.addHook('afterUpdate', async (instance, options) => {
    if (options.skipAudit) return;
    await createAuditLog({
      db,
      action: 'UPDATE',
      model,
      instance,
      oldData: options._oldData
    });
  });

  model.addHook('afterDestroy', async (instance, options) => {
    if (options.skipAudit) return;
    await createAuditLog({
      db,
      action: 'DELETE',
      model,
      instance,
      oldData: instance.toJSON()
    });
  });

  model.addHook('beforeBulkUpdate', async (options) => {
    if (options.skipAudit) return;
    const records = await model.findAll({
      where: options.where
    });
    options._oldBulkData = records.map(r => r.toJSON());
  });

  model.addHook('afterBulkUpdate', async (options) => {
    if (options.skipAudit) return;
    const updatedRecords = await model.findAll({
      where: options.where
    });

    for (let i = 0; i < updatedRecords.length; i++) {
      await createAuditLog({
        db,
        action: 'UPDATE',
        model,
        instance: updatedRecords[i],
        oldData: options._oldBulkData[i]
      });
    }
  });

  model.addHook('beforeBulkDestroy', async (options) => {
    if (options.skipAudit) return;
    const records = await model.findAll({
      where: options.where
    });
    options._oldBulkData = records.map(r => r.toJSON());
  });

  model.addHook('afterBulkDestroy', async (options) => {
    if (options.skipAudit) return;
    for (const oldData of options._oldBulkData) {
      await db.AuditLog.create(
        {
          userId: null,
          action: 'DELETE',
          model: model.name,
          tableName: model.getTableName(),
          recordId: oldData.id,
          oldData,
          newData: null
        }
      );
    }
  });
});
// End of Audit Logging Hooks
db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;

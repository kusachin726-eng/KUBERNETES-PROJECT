require("dotenv").config();

const enableSqlLogging =
  process.env.SQL_LOG === 'true' ||
  process.env.NODE_ENV === 'development';

module.exports = {
  "development": {
    "username": process.env.PGUSER,
    "password": process.env.PGPASSWORD,
    "database": process.env.PGDATABASE,
    "host": process.env.PGHOST,
    "dialect": "postgres",
    "logging": enableSqlLogging ? console.log : false,
    "pool": {
      "max": 10, // Maximum number of connection in pool
      "min": 2, // Minimum number of connection in pool
      "acquire": 30000, // The maximum time, in milliseconds, that pool will try to get connection before throwing error
      "idle": 10000, //Sequelize will close/open idle connections after 10 seconds
      "evict": 10000 //Sequelize will remove idle connections after 10 seconds
    },
    "dialectOptions": {
      "application_name": "dev_dropty_api_app",
      "ssl": {
        "require": process.env.PGSSL === "true",
        "rejectUnauthorized": false // Use this only for development
      }
    }
  },
  "staging": {
    "username": process.env.PGUSER,
    "password": process.env.PGPASSWORD,
    "database": process.env.PGDATABASE,
    "host": process.env.PGHOST,
    "dialect": "postgres",
    "logging": false,
    "pool": {
      "max": 10,
      "min": 2,
      "acquire": 30000, // The maximum time, in milliseconds, that pool will try to get connection before throwing error
      "idle": 10000, //Sequelize will close/open idle connections after 10 seconds
      "evict": 10000 //Sequelize will remove idle connections after 10 seconds  
    },
    "dialectOptions": {
      "application_name": "staging_dropty_api_app",
      "ssl": {
        "require": process.env.PGSSL === "true",
        "rejectUnauthorized": false // Be cautious about using this in staging
      }
    }
  },
  "production": {
    "username": process.env.PGUSER,
    "password": process.env.PGPASSWORD,
    "database": process.env.PGDATABASE,
    "host": process.env.PGHOST,
    "dialect": "postgres",
    "logging": false,
    "pool": {
      "max": 12,
      "min": 3,
      "acquire": 30000, // The maximum time, in milliseconds, that pool will try to get connection before throwing error
      "idle": 10000, //Sequelize will close/open idle connections after 10 seconds
      "evict": 10000 //Sequelize will remove idle connections after 10 seconds
    }, 
    "dialectOptions": {
      "application_name": "prod_dropty_api_app",
      "ssl": {
        "require": process.env.PGSSL === "true",
        "rejectUnauthorized": false // Be cautious about using this in staging
      }
    }
  }
};
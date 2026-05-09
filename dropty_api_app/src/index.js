/**
 * src/index.js
 * -------------------------------------------------------
 * PRODUCTION-GRADE SERVER STARTUP + GRACEFUL SHUTDOWN
 *
 * ✅ Keeps HTTP server reference
 * ✅ Stops accepting new requests on shutdown
 * ✅ Closes Sequelize pool cleanly
 * ✅ Matches Azure App Service SIGTERM behavior
 * -------------------------------------------------------
 */

const http = require("http");
const app = require("./app");
const startApp = require("./jobs");
const { initSocket } = require("./sockets");
require("dotenv").config();

// IMPORTANT: Import sequelize only once (used during shutdown)
const { sequelize } = require("./data-access/sequelize/models");

const PORT = process.env.APP_PORT || 3000;

// -------------------------------------------------------
// CREATE HTTP SERVER (instead of app.listen)
// This allows server.close() during shutdown
// -------------------------------------------------------
const server = http.createServer(app);
initSocket(server);

server.listen(PORT, () => {
  startApp();
  console.log(`🚀 API server running on port ${PORT}`);
});

// -------------------------------------------------------
// GRACEFUL SHUTDOWN HANDLER
// This replaces docker-compose stop_grace_period behavior
// -------------------------------------------------------
const shutdown = async (signal) => {
  console.log(`🛑 [SHUTDOWN] Received ${signal}`);

  // Stop accepting new requests
  server.close(async () => {
    console.log("✅ HTTP server closed");

    try {
      // CRITICAL: Close Sequelize connection pool
      await sequelize.close();
      console.log("✅ Sequelize pool closed");
    } catch (err) {
      console.error("❌ Error closing Sequelize pool", err);
    }

    process.exit(0);
  });

  // FORCE EXIT after 30s (Azure App Service behavior)
  setTimeout(() => {
    console.error("⏱️ [SHUTDOWN] Force exit after 30s");
    process.exit(1);
  }, 30000);
};

// Azure + Docker send SIGTERM on restart/scale
process.on("SIGTERM", shutdown);
process.on("SIGINT", shutdown);
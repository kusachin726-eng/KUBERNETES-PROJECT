const { AsyncLocalStorage } = require('async_hooks');

const storage = new AsyncLocalStorage();

const auditRequestContext = {
  run(req, res, next) {
    storage.run({
      userId: null,
      userAgent: null,
      ipAddress: null
    }, next);
  },
// Set user context for the current request
  setUserContext({ userId, userAgent, ipAddress }) {
    const store = storage.getStore();
    if (store) {
      store.userId = userId || null;
      store.userAgent = userAgent || null;
      store.ipAddress = ipAddress || null;
    }
  },
// Getters to retrieve context values in audit logger
  getUserId() {
    return storage.getStore()?.userId ?? null;
  },

  getUserAgent() {
    return storage.getStore()?.userAgent ?? null;
  },

  getIpAddress() {
    return storage.getStore()?.ipAddress ?? null;
  }
};

module.exports = auditRequestContext;
# Dropty API Copilot Instructions

## Architecture Overview

**Dropty** is a Node.js/Express REST API for an airline booking platform. The application runs behind an NGINX reverse proxy in Docker, uses PostgreSQL as the primary database, and Mongoose for auxiliary data.

**Key Stack:**
- **Runtime:** Node.js + Express
- **Primary Database:** PostgreSQL (via Sequelize ORM)
- **Auxiliary Database:** MongoDB (via Mongoose)
- **Auth:** JWT (Bearer token)
- **Reverse Proxy:** NGINX (in same Docker image)
- **File Storage:** AWS S3 + Azure Blob Storage
- **Payment:** Razorpay integration
- **Job Queue:** BullMQ + Redis

## Request Flow Pattern

All requests follow a strict MVC pattern: **Routes → Controllers → Services → Models**

### Module Structure
- `src/modules/v1/{Admin,Auth,Customer,User}/` - Feature modules
- Each module has: `[feature].routes.js` → `[feature].controller.js` → `[feature].service.js`
- Example: Admin booking flows through `Admin/booking/booking.routes.js` → `booking.controller.js` → `booking.service.js`

### Routing Pattern
Routes are centralized in `routes/v1.js` with version-prefixed endpoints:
```javascript
// Public
router.use('/auth', require('../modules/v1/Auth/auth.routes'));
router.use('/user', require('../modules/v1/User/user.routes'));

// Admin (RBAC protected)
router.use('/admin/users', require('../modules/v1/Admin/users/user.routes'));
router.use('/admin/booking', require(...));

// Customer
router.use('/customer/booking', require(...));
```

## Authentication & Authorization

**JWT Validation:**
- Extract Bearer token from `Authorization: Bearer <token>` header
- Verify against `JWT_SECRET` via `middleware/auth/tokenValidation.js`
- Decoded token stored in `req.user` (contains user ID)
- User context tracked globally via `requestContext.set('userId', decoded.id)`

**RBAC (Role-Based Access Control):**
- Implemented in `middleware/auth/rbac.js`
- Admin routes protected by role/feature checks
- Uses `admin_roles`, `admin_permissions`, `admin_role_features` tables
- Feature-level permissions enforced at route level

## Controller & Service Pattern

**Controllers** (`[feature].controller.js`):
- Classes with async methods bound to routes
- Use `catchAsyncErr()` wrapper to auto-catch promise rejections
- Example: `getUserDetails(req, res, next)` extracts params and calls service
- Throw `AppError` for validation/business logic failures

**Services** (`[feature].service.js`):
- Pure business logic layer
- Query models via Sequelize (`db.ModelName.findAll()`, etc.)
- No HTTP knowledge; receive/return plain objects
- Handle data transformation before returning to controller

**Error Handling Pattern:**
```javascript
// Controller
async getUser(req, res, next) {
    const { id } = req.params;
    const user = await userService.getUserById(id);
    if (!user) throw new AppError("User not found", 404);
    res.status(200).json({ success: true, data: user });
}

// Wrap routes with catchAsyncErr
router.get('/:id', catchAsyncErr(controller.getUser.bind(controller)));

// Global error middleware handles AppError
```

## Data Access Layer

**Sequelize (PostgreSQL ORM):**
- Models in `data-access/sequelize/models/`
- Config in `data-access/sequelize/config/config.js` (environment-driven)
- Connection pooling: min=2, max=10, idle timeout=10s
- Logging enabled in development via `SQL_LOG=true` or `NODE_ENV=development`

**Database Migrations:**
- Location: `data-access/sequelize/migrations/`
- Commands:
  - `npm run migration` - run pending migrations
  - `npm run migration-undo` - rollback last migration
  - `npm run migration-undo-all` - rollback all migrations
- Create new model: `npm run create-model -- ModelName`

**Foreign Key Constraints:**
- Errors caught by custom error handler (`errorController.js`)
- Returns HTTP 409 with user-friendly message
- Example: "Cannot delete role because it's assigned in permissions"

## Validation Pattern

Use Hapi Joi schema middleware on routes:
```javascript
const validate = require('../../middleware/validator');
const { body, query, params } = require('@hapi/joi');

router.get(
  '/',
  validate({
    query: Joi.object({
      page: Joi.number().default(1),
      limit: Joi.number().default(10),
      searchKey: Joi.string().optional()
    })
  }),
  catchAsyncErr(controller.list.bind(controller))
);
```

## Configuration & Environment Variables

**Required Variables (validated at startup):**
- `NODE_ENV` - development/staging/production
- `APP_PORT` - app server port (default: 3005)
- `PGHOST`, `PGPORT`, `PGUSER`, `PGPASSWORD`, `PGDATABASE` - PostgreSQL connection
- `JWT_SECRET` - JWT signing key
- `PGSSL` - (optional) require SSL for Postgres

**Optional (Docker/NGINX):**
- `RATE_LIMIT_RATE` - NGINX rate limit (default: 5r/s)
- `RATE_LIMIT_BURST` - burst capacity (default: 10)
- `RATE_LIMIT_ENABLED` - disable rate limiting (default: 1)
- `USE_NPM_START` - use `npm start` if 1, else run `node $NODE_ENTRY` (default: 1)

**Development:**
- Copy `.env.template` to `.env` (never commit real `.env`)
- Run `npm dev` (nodemon watches changes)
- Run `npm start` for production

## Health & Readiness Endpoints

- `GET /health` - NGINX-served liveness check (response: "OK")
- `GET /ready` - Readiness check proxied to app
  - Verifies PostgreSQL connectivity via `sequelize.authenticate()` with 2s timeout
  - Returns 200 if DB is reachable, 500 otherwise
  - Used by Docker HEALTHCHECK and K8s probes

## Logging

**Winston Logger** (`config/logger.js`):
- Three transports: console + file (combined + error logs)
- Auto-logged via middleware on every request
- Use `consoleLogger` or `fileLogger` objects in code for manual logging
- Logs stored in `logs/` directory

## Development Workflows

**Start Development:**
```bash
npm install
npm dev           # nodemon with live reload
```

**Database Setup:**
```bash
npm run migration --env development    # apply migrations
npm run migration-undo                 # rollback last
```

**Create New Module:**
1. Create folder in `src/modules/v1/[Feature]/`
2. Add `[feature].routes.js`, `[feature].controller.js`, `[feature].service.js`
3. Register route in `routes/v1.js`: `router.use('/path', require(...))`

**Docker Local Testing:**
```bash
docker build -t dropty-api:dev .
docker run --rm \
  -e NODE_ENV=development \
  -e APP_PORT=3005 \
  -e PG* (database vars) \
  -e JWT_SECRET=test \
  -p 80:80 -p 3005:3005 \
  dropty-api:dev
```

## Key Files Reference

| File | Purpose |
|------|---------|
| `src/routes/v1.js` | Route registration hub |
| `src/app.js` | Express app setup, middleware chain |
| `src/middleware/validator.js` | Joi validation middleware |
| `src/middleware/auth/tokenValidation.js` | JWT verification |
| `src/utils/errorHandler/catchAsyncErr.js` | Async error wrapper |
| `src/utils/errorHandler/appError.js` | Custom error class |
| `src/data-access/sequelize/config/config.js` | DB connection config |
| `Dockerfile` | Multi-stage build with Node + NGINX |
| `docker-entrypoint.sh` | Container startup script |

## Common Pitfalls

1. **Not using `catchAsyncErr()`** - Promise rejections in async handlers won't reach global error middleware
2. **Direct model queries in controllers** - Keep data access in services only
3. **Forgetting `bind(this)` in routes** - Class methods lose context without binding
4. **Mutation of request context** - Use `requestContext.set()` for user tracking, not global variables
5. **RBAC checks missing** - Admin endpoints must verify `req.user.role` and feature permissions
6. **No migration for schema changes** - Always create migrations for DB changes, never raw SQL


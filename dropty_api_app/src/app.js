const express = require('express');
const cors = require('cors');
const auditRequestContext = require('./utils/auditLog/auditRequestContext');
const { initializeFirebase } = require("./config/firebase/index");

const app = express();
//Enable trust proxy to get correct client IP when behind a proxy
app.set('trust proxy', 1);

// Error handling
const errorCotroller = require("./utils/errorHandler/errorCotroller");
const {consoleLogger, fileLogger, loggerMiddleware} = require("./config/logger");
const limiter = require("./config/rateLimiter");
const  connectDb  = require('./data-access/mongoose');
const path = require('path');
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static('public'));



app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true}));
app.use(auditRequestContext.run);
app.use(loggerMiddleware);
app.use(limiter);

 
connectDb()


// firebase
initializeFirebase();   // 👈 MUST be called before using messaging

// write a health check route in one line
app.get('/health', (req, res) => res.status(200).send('OK'));
app.get('/', (req, res) => res.send('Dropty API is running'));

app.use('/api/v1', require('./routes/v1'));

/***************************** Error Handling **************************** */
app.all('*', (req, res, next)=>{
    const err = new Error(`Requested URL ${req.path} not found`);
    err.statusCode = 404;
    next(err);
});

function getRoutes(app) {
    app._router.stack.forEach((middleware) => {
        if (middleware.route) {
            // If it's a normal route
            const methods = Object.keys(middleware.route.methods).join(', ').toUpperCase();
            console.log(`${methods} ${middleware.route.path}`);
        } else if (middleware.name === 'router') {
            // If it's a router middleware (e.g., routes/v1.js)
            middleware.handle.stack.forEach((handler) => {
                const route = handler.route;
                if (route) {
                    const methods = Object.keys(route.methods).join(', ').toUpperCase();
                    console.log(`${methods} ${route.path}`);
                }
            });
        }
    });
}
getRoutes(app);

app.use(errorCotroller);
module.exports = app;


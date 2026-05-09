const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
    windowMs:  2000, //2 sec 
    max: 20, // Limit each IP to 20 requests per `window` 
    message: {
        "success": 0,
        "message":'Too many requests, please try again after some time',
        "data": []
    },
  });

module.exports = limiter;
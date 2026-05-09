require('dotenv').config({ path: require('path').resolve(__dirname, '../../../.env') });
const mongoose = require('mongoose');

const {logger} = require('../../config/logger');
const URI = process.env.MONGO_URI

module.exports = async function connectDb() {
    try {
        
        // const connectionInstant = await mongoose.connect(URI);
        // logger.info('Connected to mongodb Database : ' + connectionInstant.connection.host);
    }
    catch (err) {
        logger.error("mongoDB connection ERROR:",err);
        process.exit(1);
    }
}

 




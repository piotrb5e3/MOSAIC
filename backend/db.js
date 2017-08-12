const config = require('./config');
const mongoose = require('mongoose');
const log = require('./log');
require('./models/setup');

mongoose.Promise = global.Promise;
const uri = `mongodb://${config.db.host}:${config.db.port}/${config.db.dbname}`;
const options = {
    useMongoClient: true,
    user: config.db.user,
    pass: config.db.password,
};

module.exports = () => {
    log.info(`Attempting to connect to database ${config.db.dbname}`
        + ` on ${config.db.host}:${config.db.port} with user ${config.db.user}`);
    return mongoose
        .connect(uri, options);
};

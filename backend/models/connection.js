const log = require('../log');
const mongoose = require('mongoose');

log.debug('Setting up the connection model');

const connectionSchema = mongoose.Schema({
    from: String,
    to: String,
});

const Connection = mongoose.model('Connection', connectionSchema);

module.exports = Connection;

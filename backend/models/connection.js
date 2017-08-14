const log = require('./logger');
const mongoose = require('mongoose');

log.debug('Setting up the connection model');

const connectionSchema = mongoose.Schema({
    from: { type: String, required: true, index: true },
    to: { type: String, required: true },
});

const Connection = mongoose.model('Connection', connectionSchema);

module.exports = Connection;

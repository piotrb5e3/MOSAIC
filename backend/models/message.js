const log = require('../log');
const mongoose = require('mongoose');

log.debug('Setting up the message model');

const messageSchema = mongoose.Schema({
    from: String,
    contents: String,
});

const Message = mongoose.model('Message', messageSchema);

module.exports = Message;

const log = require('./logger');
const mongoose = require('mongoose');

log.debug('Setting up the message model');

const messageSchema = mongoose.Schema({
    from: { type: String, required: true, index: true },
    content: { type: String, required: true },
    timestamp: { type: Date, required: true },
});

const Message = mongoose.model('Message', messageSchema);

module.exports = Message;

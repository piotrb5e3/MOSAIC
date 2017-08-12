const log = require('./log');
const newMessageController = require('./controllers/newMessage');
const listMessagesController = require('./controllers/listMessages');

module.exports = {
    route(app) {
        log.debug('Adding POST route /message');
        app.post('/message', newMessageController);

        log.debug('Adding GET route /messages');
        app.get('/messages', listMessagesController);
    },
};

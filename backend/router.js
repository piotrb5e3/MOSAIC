const log = require('./logger');
const newMessageController = require('./controllers/newMessage');
const listMessagesController = require('./controllers/listMessages');
const requestConnectionController = require('./controllers/requestConnection');
const connectionStatusController = require('./controllers/connectionStatus');
const disconnectController = require('./controllers/disconnect');

module.exports = {
    route(app) {
        log.debug('Adding POST route /message');
        app.post('/message', newMessageController);

        log.debug('Adding GET route /messages');
        app.get('/messages', listMessagesController);

        log.debug('Adding POST route /connect');
        app.post('/connect', requestConnectionController);

        log.debug('Adding GET route /connection-status');
        app.get('/connection-status', connectionStatusController);

        log.debug('Adding POST route /disconnect');
        app.post('/disconnect', disconnectController);
    },
};

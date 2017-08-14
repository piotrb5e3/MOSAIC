const log = require('../logger');
const sub = require('../redisFactory')();
const constants = require('../constants');
const connectionPairedNotifier = require('../notifiers/connectionPairedNotifier');

const connectionPairer = {
    awaiting: null,
    newConn(id) {
        if (this.awaiting === null) {
            this.awaiting = id;
        } else {
            const awaiting = this.awaiting;
            this.awaiting = null;
            connectionPairedNotifier(awaiting, id);
        }
    },
};

sub.subscribe(constants.unpairedConnectionsChannelName).then(() => {
    log.info('Succesfully subscribed to the unpaired connections channel');
}).then(() => {
    sub.on('message', (channel, message) => {
        log.debug(`Received new unpaired id: ${message}`);
        connectionPairer.newConn(message);
    });
}).catch((err) => {
    log.error(`Connection pairer setup failed with error: ${err}`);
});

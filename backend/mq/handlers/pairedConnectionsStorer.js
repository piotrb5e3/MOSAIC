const redisFactory = require('../redisFactory');
const constants = require('../constants');
const log = require('../logger');
const connectionManager = require('../../managers/connectionManager');

const sub = redisFactory();

function storeConnectionPair(id1, id2) {
    connectionManager.connect({
        u1: id1,
        u2: id2,
    }).then(() => {
        log.debug(`Successfully stored connection of ${id1} and ${id2}`);
    }).catch((err) => {
        log.error(`Error when storing connection of ${id1} and ${id2}. ${err}`);
    });
}

sub.subscribe(constants.pairedConnectionsChannelName).then(() => {
    log.info('Succesfully subscribed to the paired connections channel');
    sub.on('message', (channel, message) => {
        const deserializedMessage = JSON.parse(message);
        storeConnectionPair(deserializedMessage.id1, deserializedMessage.id2);
    });
}).catch((err) => {
    log.error(`Paired connection storer setup failed with error: ${err}`);
});

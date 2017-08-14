const log = require('../logger');
const pub = require('../redisFactory')();
const constants = require('../constants');

module.exports = (id1, id2) => {
    log.debug(`Pairing ${id1} and ${id2}`);
    pub.publish(
        constants.pairedConnectionsChannelName,
        JSON.stringify({ id1, id2 }),
    ).catch((err) => {
        log.error(`Error notyfying about pairing. ${err}`);
    });
};

const log = require('../logger');
const pub = require('../redisFactory.js')();
const constants = require('../constants');

module.exports = (id) => {
    log.debug(`Notyfying about a new connection: ${id}`);
    return pub.publish(constants.unpairedConnectionsChannelName, id);
};

const Redis = require('ioredis');
const config = require('../config');
const log = require('./logger');

Redis.Promise.onPossiblyUnhandledRejection((error) => {
    log.error('Unhandled Redis error.'
    + ` Command: ${error.command.name}, Args: ${error.command.args}`);
    process.exit(1);
});

module.exports = () => {
    log.info(`Connecting to redis at ${config.mq.host}:${config.mq.port}`);
    const redis = new Redis(null, null, {
        port: config.mq.port,
        host: config.mq.host,
        showFriendlyErrorStack: true,
        lazyConnect: true,
    });
    redis.connect()
        .then(() => {
            log.info(`Succesfully connected to redis at ${config.mq.host}:${config.mq.port}`);
        })
        .catch((err) => {
            log.error(`Error connecting to redis at ${config.mq.host}:${config.mq.port}. ${err}`);
            process.exit(1);
        });
    return redis;
};

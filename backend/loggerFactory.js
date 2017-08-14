const log4js = require('log4js');

log4js.configure({
    appenders: {
        console: {
            type: 'console',
        },
    },
    categories: {
        default: {
            appenders: ['console'],
            level: 'debug',
        },
        controllers: {
            appenders: ['console'],
            level: 'debug',
        },
        managers: {
            appenders: ['console'],
            level: 'debug',
        },
        models: {
            appenders: ['console'],
            level: 'debug',
        },
        sevices: {
            appenders: ['console'],
            level: 'debug',
        },
        mq: {
            appenders: ['console'],
            level: 'debug',
        },
        app: {
            appenders: ['console'],
            level: 'debug',
        },
    },
});

module.exports = log4js.getLogger;

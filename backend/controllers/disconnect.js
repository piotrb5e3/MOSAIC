const log = require('./logger');
const userCodeValidator = require('./validators').userCodeValidator;
const withValidator = require('./helpers/withValidator');
const withActiveConnection = require('./helpers/withActiveConnection');
const connectionManager = require('../managers/connectionManager');

module.exports = (req, res) => {
    withValidator(req, res, userCodeValidator, () => {
        withActiveConnection(req, res, req.body.code, (connection) => {
            Promise.all([
                connectionManager.deleteConnection(connection.from),
                connectionManager.deleteConnection(connection.to),
            ]).then(() => {
                log.debug(`Deleted connection of ${connection.from} and ${connection.to}`);
                res.status(204);
                res.send();
            }).catch((err) => {
                log.error(`Disconnect failed. ${err}`);
                res.status(500);
                res.send();
            });
        });
    });
};

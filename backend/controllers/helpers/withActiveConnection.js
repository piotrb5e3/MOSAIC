const log = require('../logger');
const connectionManager = require('../../managers/connectionManager');

function defaultFailureCb(res) {
    return () => {
        res.status(400);
        res.json({ error: 'Connection inactive' });
    };
}

module.exports = (req, res, id, successCb, failure) => {
    const failureCb = failure || defaultFailureCb(res);

    connectionManager.getConnection(id)
        .then((connection) => {
            if (connection === null) {
                failureCb();
            } else {
                successCb(connection);
            }
        }).catch((err) => {
            log.error(`Find connection failed: ${err}`);
            res.status(500);
            res.send();
        });
};

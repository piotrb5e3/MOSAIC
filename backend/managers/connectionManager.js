const log = require('./logger');
const Connection = require('../models/connection');

module.exports = {
    connect({ u1, u2 }) {
        const conn1 = new Connection({ from: u1, to: u2 });
        const conn2 = new Connection({ from: u2, to: u1 });
        return Promise.all([conn1.save(), conn2.save()]);
    },
    getConnection(from) {
        log.debug(`Looking for connection from ${from}`);
        return Connection.findOne({ from });
    },
    deleteConnection(from) {
        log.debug(`Deleting connection from ${from}`);
        return this.getConnection(from).then((connection) => {
            if (connection === null) {
                log.error(`Deleting connection ${from}, but it does not exist`);
                return Promise.reject('Connection does not exist');
            }
            return connection.remove();
        });
    },
};

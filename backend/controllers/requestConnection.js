const log = require('./logger');
const uuidGeneratorService = require('../services/uuidGenerator');
const newConnectionNotifier = require('../mq/notifiers/newConnectionNotifier');

module.exports = (req, res) => {
    const id = uuidGeneratorService.getUUID();

    newConnectionNotifier(id)
        .then(() => {
            log.debug(`Succesfully notified about ${id}`);
            res.status(201);
            res.json({ code: id });
        }).catch((err) => {
            log.error(`Notyfying about ${id} failed. ${err}`);
            res.status(500);
            res.send();
        });
};

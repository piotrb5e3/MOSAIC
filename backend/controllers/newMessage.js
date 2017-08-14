const log = require('./logger');
const messageManager = require('../managers/messageManager');
const newMessageValidator = require('./validators').newMessageValidator;
const withValidator = require('./helpers/withValidator');
const withActiveConnection = require('./helpers/withActiveConnection');

module.exports = (req, res) => {
    withValidator(req, res, newMessageValidator, () => {
        withActiveConnection(req, res, req.body.from, (/* connection */) =>
            messageManager.createNewMessage({
                from: req.body.from,
                content: req.body.content,
            }).then(() => {
                res.status(201);
                res.send();
            }).catch((err) => {
                log.error(`New message creation failed. ${err}`);
                res.status(500);
                res.send();
            }));
    });
};

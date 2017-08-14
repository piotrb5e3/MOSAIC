const log = require('./logger');
const userCodeValidator = require('./validators').userCodeValidator;
const messageManager = require('../managers/messageManager');
const withValidator = require('./helpers/withValidator');
const withActiveConnection = require('./helpers/withActiveConnection');

function messageMarkOwn(own) {
    return ({ content, timestamp }) => ({ own, content, timestamp });
}

module.exports = (req, res) => {
    withValidator(req, res, userCodeValidator, () => {
        withActiveConnection(req, res, req.body.code, (connection) => {
            Promise.all([
                messageManager.getMessagesFrom(connection.from),
                messageManager.getMessagesFrom(connection.to),
            ]).then((messagesLists) => {
                const myMessages = messagesLists[0].map(messageMarkOwn(true));
                const theirMessages = messagesLists[1].map(messageMarkOwn(false));
                const messages = myMessages.concat(theirMessages);
                res.status(200);
                res.json({ messages });
            }).catch((err) => {
                log.error(`Finding messages failed. ${err}`);
                res.status(500);
                res.send();
            });
        });
    });
};

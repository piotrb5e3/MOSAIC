const Message = require('../models/message');

module.exports = {
    createNewMessage({ from, content }) {
        const timestamp = new Date();
        const newMessage = new Message({ from, content, timestamp });
        return newMessage.save();
    },
    getAllMessages() {
        return Message.find()
            .then(messages => messages.map(this.filterMessageFields));
    },
    getMessagesFrom(from) {
        return Message.find({ from })
            .then(messages => messages.map(this.filterMessageFields));
    },
    filterMessageFields({ from, content, timestamp }) {
        return { from, content, timestamp };
    },
};

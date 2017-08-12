const log = require('../log');
const Ajv = require('ajv');
const Message = require('../models/message');

const ajv = new Ajv();

const newMessageSchema = {
    properties: {
        from: {
            type: 'string',
        },
        content: {
            type: 'string',
        },
    },
    required: ['from', 'content'],
    additionalProperties: false,
};
const validate = ajv.compile(newMessageSchema);

module.exports = (req, res) => {
    if (!validate(req.body)) {
        res.status(400).json({
            errors: validate.errors,
        });
    } else {
        const newMessage = new Message({
            from: req.body.from,
            content: req.body.content,
        });

        newMessage.save()
            .then(() => res.status(201).send())
            .catch((err) => {
                log.error(`New message creation failed with error: ${err}`);
                res.status(500).send();
            });
    }
};

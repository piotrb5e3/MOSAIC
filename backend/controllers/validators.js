const Ajv = require('ajv');

const ajv = new Ajv();

const newMessageSchema = {
    properties: {
        from: { type: 'string' },
        content: { type: 'string', minLength: 1 },
    },
    required: ['from', 'content'],
    additionalProperties: false,
};

const userCodeSchema = {
    properties: {
        code: { type: 'string' },
    },
    required: ['code'],
    additionalProperties: false,
};

module.exports = {
    newMessageValidator: ajv.compile(newMessageSchema),
    userCodeValidator: ajv.compile(userCodeSchema),
};

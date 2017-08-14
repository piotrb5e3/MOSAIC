const chai = require('chai');
const faker = require('faker');

const validators = require('../../controllers/validators');

const assert = chai.assert;

describe('newMessageValidator', () => {
    it('accepts example request', () => {
        const req = {
            from: faker.name.firstName(),
            content: faker.lorem.sentences(10),
        };
        assert.isTrue(validators.newMessageValidator(req));
    });

    it('rejects on missing from', () => {
        const req = {
            content: faker.lorem.sentences(10),
        };
        assert.isFalse(validators.newMessageValidator(req));
    });

    it('rejects on missing content', () => {
        const req = {
            from: faker.name.firstName(),
        };
        assert.isFalse(validators.newMessageValidator(req));
    });

    it('rejects on empty content', () => {
        const req = {
            from: faker.name.firstName(),
            content: '',
        };
        assert.isFalse(validators.newMessageValidator(req));
    });

    it('rejects on incorrect content type', () => {
        const req = {
            from: faker.name.firstName(),
            content: faker.random.number(),
        };
        assert.isFalse(validators.newMessageValidator(req));
    });

    it('rejects on extra fields', () => {
        const req = {
            from: faker.name.firstName(),
            content: faker.lorem.sentences(10),
            foo: faker.hacker.phrase(),
        };
        assert.isFalse(validators.newMessageValidator(req));
    });
});

describe('userCodeValidator', () => {
    it('accepts example request', () => {
        const req = {
            code: faker.name.firstName(),
        };
        assert.isTrue(validators.userCodeValidator(req));
    });

    it('rejects on missing code', () => {
        const req = {};
        assert.isFalse(validators.userCodeValidator(req));
    });

    it('rejects on incorrect code type', () => {
        const req = {
            code: [faker.name.firstName()],
        };
        assert.isFalse(validators.userCodeValidator(req));
    });

    it('rejects on extra fields', () => {
        const req = {
            code: faker.name.firstName(),
            bar: [faker.hacker.phrase()],
        };
        assert.isFalse(validators.userCodeValidator(req));
    });
});

const chai = require('chai');

const uuidGeneratorService = require('../../services/uuidGenerator');

const assert = chai.assert;
const uuid4regexp = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[0-9a-f]{4}-[0-9a-f]{12}$/;

describe('uuidGeneratorService', () => {
    describe('getUUID', () => {
        it('returns UUID4s', () => {
            assert.match(uuidGeneratorService.getUUID(), uuid4regexp);
        });
    });
});

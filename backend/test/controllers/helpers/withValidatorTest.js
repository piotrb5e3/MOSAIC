const sinon = require('sinon');
const chai = require('chai');
const faker = require('faker');

const assert = chai.assert;

const withValidator = require('../../../controllers/helpers/withValidator');

describe('withValidatorHelper', () => {
    const sandbox = sinon.sandbox.create();

    afterEach(() => {
        sandbox.verify();
    });

    it('calls callback on successful validation', () => {
        const body = { a: faker.commerce.product(), b: faker.internet.ip() };
        const successCb = sandbox.spy();
        const validate = sandbox.stub().returns(true);

        withValidator({ body }, {}, validate, successCb);

        assert(successCb.calledOnce);
        assert(validate.calledBefore(successCb));
        assert(validate.calledWithExactly(body));
    });

    it('sends 400 and error message on failed validation', () => {
        const body = { a: faker.commerce.product(), b: faker.internet.ip() };
        const expectedErrors = [faker.hacker.abbreviation(), faker.hacker.abbreviation()];
        const successCb = sandbox.spy();
        const validate = sandbox.stub().returns(false);
        validate.errors = expectedErrors;

        const res = { status() {}, json() {} };
        const resMock = sandbox.mock(res);
        resMock.expects('status').once().withExactArgs(400);
        resMock.expects('json').once().withExactArgs({ errors: expectedErrors });

        withValidator({ body }, res, validate, successCb);

        assert(successCb.notCalled);
        assert(validate.calledWithExactly(body));
    });
});

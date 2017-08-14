const sinon = require('sinon');
const mockery = require('mockery');
const chai = require('chai');
const faker = require('faker');

const assert = chai.assert;

describe('requestConnectionController', () => {
    const sandbox = sinon.sandbox.create();

    beforeEach(() => {
        mockery.enable({ useCleanCache: true });
        mockery.registerMock('./logger', { error() {}, debug() {} });
        mockery.registerAllowable('../../controllers/requestConnection');
    });

    afterEach(() => {
        mockery.deregisterAll();
        mockery.disable();
        sandbox.verify();
    });

    it('calls newConnectionNotifier with generated id', () => {
        const newId = faker.random.uuid();
        const uuidGeneratorService = { getUUID: sandbox.stub().returns(newId) };
        const newConnectionNotifier = sandbox.stub().resolves();

        mockery.registerMock('../services/uuidGenerator', uuidGeneratorService);
        mockery.registerMock('../mq/notifiers/newConnectionNotifier', newConnectionNotifier);
        // eslint-disable-next-line global-require
        const newMessageHandler = require('../../controllers/requestConnection');

        const res = { status() {}, json() {}, send() {} };
        const req = {};

        newMessageHandler(req, res);

        assert(newConnectionNotifier.calledOnce);
        assert(newConnectionNotifier.calledWithExactly(newId));
    });

    it('returns id and 201 on successful notify', (done) => {
        const newId = faker.random.uuid();
        const uuidGeneratorService = { getUUID: sandbox.stub().returns(newId) };
        const newConnectionNotifier = sandbox.stub().resolves();

        mockery.registerMock('../services/uuidGenerator', uuidGeneratorService);
        mockery.registerMock('../mq/notifiers/newConnectionNotifier', newConnectionNotifier);
        // eslint-disable-next-line global-require
        const newMessageHandler = require('../../controllers/requestConnection');

        const res = { status() {}, json() {}, send() {} };
        const req = {};
        const resMock = sandbox.mock(res);
        resMock.expects('status').once().withExactArgs(201);
        resMock.expects('json').once().withExactArgs({ code: newId }).callsFake(() => done());

        newMessageHandler(req, res);
    });

    it('returns id and 500 on unsuccessful notify', (done) => {
        const newId = faker.random.uuid();
        const uuidGeneratorService = { getUUID: sandbox.stub().returns(newId) };
        const newConnectionNotifier = sandbox.stub().rejects();

        mockery.registerMock('../services/uuidGenerator', uuidGeneratorService);
        mockery.registerMock('../mq/notifiers/newConnectionNotifier', newConnectionNotifier);
        // eslint-disable-next-line global-require
        const newMessageHandler = require('../../controllers/requestConnection');

        const res = { status() {}, json() {}, send() {} };
        const req = {};
        const resMock = sandbox.mock(res);
        resMock.expects('status').once().withExactArgs(500);
        resMock.expects('send').once().withExactArgs().callsFake(() => done());

        newMessageHandler(req, res);
    });
});

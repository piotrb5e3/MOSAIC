const sinon = require('sinon');
const mockery = require('mockery');


function mockSuccessAjv() {}
mockSuccessAjv.prototype.compile = () => () => true;

function mockFailAjv() {}
mockFailAjv.prototype.compile = () => () => false;

const req = { body: { from: 'a', content: 'b' } };

function mockSuccessfullySavingMessage() {}
mockSuccessfullySavingMessage.prototype.save = () =>
    new Promise((resolve /* ,  reject */) => { resolve(); });

function mockFailSavingMessage() {}
mockFailSavingMessage.prototype.save = () =>
    new Promise((resolve, reject) => { reject('err'); });

describe('NewMessage controller', () => {
    const sandbox = sinon.sandbox.create();

    beforeEach(() => {
        mockery.enable({ useCleanCache: true });
    });

    afterEach(() => {
        mockery.deregisterAll();
        mockery.disable();
        sandbox.verify();
        sandbox.reset();
        sandbox.resetBehavior();
        sandbox.resetHistory();
    });

    it('returns 400 on validation error', () => {
        mockery.registerMock('ajv', mockFailAjv);
        mockery.registerMock('../log', { error: () => {} });
        mockery.registerMock('../models/message', {});
        mockery.registerAllowable('../controllers/newMessage');
        // eslint-disable-next-line global-require
        const newMessageHandler = require('../controllers/newMessage');

        const res = {
            status() {},
            json() {},
            send() {},
        };
        const resMock = sandbox.mock(res);

        resMock.expects('status').once().withExactArgs(400).returns(res);
        resMock.expects('json').once();
        newMessageHandler(req, res);
    });

    it('returns 201 on validation success', (done) => {
        mockery.registerMock('ajv', mockSuccessAjv);
        mockery.registerMock('../log', { error: () => {} });
        mockery.registerMock('../models/message', mockSuccessfullySavingMessage);
        mockery.registerAllowable('../controllers/newMessage');
        // eslint-disable-next-line global-require
        const newMessageHandler = require('../controllers/newMessage');

        const res = {
            status() {},
            json() {},
            send() {},
        };
        const resMock = sandbox.mock(res);

        resMock.expects('status').once().withExactArgs(201).returns(res);
        resMock.expects('send').once().callsFake(done());

        newMessageHandler(req, res);
    });

    it('returns 500 on message save fail', (done) => {
        mockery.registerMock('ajv', mockSuccessAjv);
        mockery.registerMock('../log', { error: () => {} });
        mockery.registerMock('../models/message', mockFailSavingMessage);
        mockery.registerAllowable('../controllers/newMessage');
        // eslint-disable-next-line global-require
        const newMessageHandler = require('../controllers/newMessage');
        mockery.disable();

        const res = {
            status() {},
            json() {},
            send() {},
        };
        const resMock = sandbox.mock(res);

        resMock.expects('status').once().withExactArgs(500).returns(res);
        resMock.expects('send').once().callsFake(done);

        newMessageHandler(req, res);
    });
});

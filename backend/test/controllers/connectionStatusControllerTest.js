const sinon = require('sinon');
const mockery = require('mockery');

describe('connectionStatusController', () => {
    const sandbox = sinon.sandbox.create();

    beforeEach(() => {
        mockery.enable({ useCleanCache: true });
        mockery.registerMock('./validators', {});
        mockery.registerMock('./helpers/withValidator', (_1, _2, _3, cb) => cb());
        mockery.registerAllowable('../../controllers/connectionStatus');
    });

    afterEach(() => {
        mockery.deregisterAll();
        mockery.disable();
        sandbox.verify();
    });

    it('returns active: true and 200 on connection found', (done) => {
        mockery.registerMock('./helpers/withActiveConnection', (_1, _2, _3, cb) => cb());
        // eslint-disable-next-line global-require
        const connectionStatusHandler = require('../../controllers/connectionStatus');

        const req = { body: { } };
        const res = { status() {}, json() {}, send() {} };
        const resMock = sandbox.mock(res);

        resMock.expects('status').once().withExactArgs(200);
        resMock.expects('json').once().withExactArgs({ active: true })
            .callsFake(() => done());

        connectionStatusHandler(req, res);
    });

    it('returns active: false and 200 on connection not found', (done) => {
        mockery.registerMock('./helpers/withActiveConnection', (_1, _2, _3, _4, cb) => cb());
        // eslint-disable-next-line global-require
        const connectionStatusHandler = require('../../controllers/connectionStatus');

        const req = { body: { } };
        const res = { status() {}, json() {}, send() {} };
        const resMock = sandbox.mock(res);

        resMock.expects('status').once().withExactArgs(200);
        resMock.expects('json').once().withExactArgs({ active: false })
            .callsFake(() => done());

        connectionStatusHandler(req, res);
    });
});

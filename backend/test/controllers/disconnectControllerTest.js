const sinon = require('sinon');
const mockery = require('mockery');
const faker = require('faker');

describe('disconnectController', () => {
    const sandbox = sinon.sandbox.create();
    const connection = { from: faker.name.firstName(), to: faker.name.firstName() };

    beforeEach(() => {
        mockery.enable({ useCleanCache: true });
        mockery.registerMock('./validators', {});
        mockery.registerMock('./logger', { debug() {}, error() {} });
        mockery.registerMock('./helpers/withValidator', (_1, _2, _3, cb) => cb());
        mockery.registerMock('./helpers/withActiveConnection', (_1, _2, _3, cb) => cb(connection));
        mockery.registerAllowable('../../controllers/disconnect');
    });

    afterEach(() => {
        mockery.deregisterAll();
        mockery.disable();
        sandbox.verify();
    });

    it('calls deleteConnection for both parties', (done) => {
        const connectionManager = { deleteConnection: () => {} };
        mockery.registerMock('../managers/connectionManager', connectionManager);
        // eslint-disable-next-line global-require
        const disconnectHandler = require('../../controllers/disconnect');

        const res = { status() {}, send: sandbox.stub().callsFake(() => done()) };
        const req = { body: { code: connection.from } };
        const connectionManagerMock = sandbox.mock(connectionManager);

        connectionManagerMock.expects('deleteConnection').once()
            .withExactArgs(connection.from).resolves();
        connectionManagerMock.expects('deleteConnection').once()
            .withExactArgs(connection.to).resolves();

        disconnectHandler(req, res);
    });

    it('returns 204 on succesful delete', (done) => {
        const connectionManager = { deleteConnection: sandbox.stub().resolves() };
        mockery.registerMock('../managers/connectionManager', connectionManager);
        // eslint-disable-next-line global-require
        const disconnectHandler = require('../../controllers/disconnect');

        const res = { status() {}, send() {} };
        const req = { body: { code: connection.from } };
        const resMock = sandbox.mock(res);

        resMock.expects('status').once().withExactArgs(204);
        resMock.expects('send').once().callsFake(() => done());

        disconnectHandler(req, res);
    });

    it('returns 500 on failed delete', (done) => {
        const connectionManager = { deleteConnection: sandbox.stub().rejects() };
        mockery.registerMock('../managers/connectionManager', connectionManager);
        // eslint-disable-next-line global-require
        const disconnectHandler = require('../../controllers/disconnect');

        const res = { status() {}, send() {} };
        const req = { body: { code: connection.from } };
        const resMock = sandbox.mock(res);

        resMock.expects('status').once().withExactArgs(500);
        resMock.expects('send').once().callsFake(() => done());

        disconnectHandler(req, res);
    });
});

const sinon = require('sinon');
const chai = require('chai');
const mockery = require('mockery');
const faker = require('faker');

const failFun = () => chai.assert.fail();

describe('withActiveConnectionHelper', () => {
    const sandbox = sinon.sandbox.create();
    const connection = { from: faker.name.firstName(), to: faker.name.firstName() };

    beforeEach(() => {
        mockery.enable({ useCleanCache: true });
        mockery.registerMock('../logger', { error() {} });
        mockery.registerAllowable('../../../controllers/helpers/withActiveConnection');
    });

    afterEach(() => {
        mockery.deregisterAll();
        mockery.disable();
        sandbox.verify();
    });

    it('calls connectionManager and callback on connection found', (done) => {
        const connectionManager = { getConnection() {} };
        mockery.registerMock('../../managers/connectionManager', connectionManager);
        // eslint-disable-next-line global-require
        const withActiveConnectionHelper = require('../../../controllers/helpers/withActiveConnection');

        const successCbObj = { cb() {} };

        const connectionManagerMock = sandbox.mock(connectionManager);
        const successCbObjMock = sandbox.mock(successCbObj);

        connectionManagerMock.expects('getConnection').once()
            .withExactArgs(connection.from).resolves(connection);
        successCbObjMock.expects('cb').once().withExactArgs(connection).callsFake(() => done());

        withActiveConnectionHelper({}, {}, connection.from, successCbObj.cb);
    });

    it('calls connectionManager and executes default callback on connection not found', (done) => {
        const connectionManager = { getConnection() {} };
        mockery.registerMock('../../managers/connectionManager', connectionManager);
        // eslint-disable-next-line global-require
        const withActiveConnectionHelper = require('../../../controllers/helpers/withActiveConnection');

        const res = { status() {}, json() {} };
        const resMock = sandbox.mock(res);
        const connectionManagerMock = sandbox.mock(connectionManager);

        resMock.expects('status').once().withExactArgs(400);
        resMock.expects('json').once()
            .withExactArgs({ error: 'Connection inactive' }).callsFake(() => done());
        connectionManagerMock.expects('getConnection').once()
            .withExactArgs(connection.from).resolves(null);

        withActiveConnectionHelper({}, res, connection.from, failFun);
    });

    it('calls connectionManager and executes provided callback on connection not found', (done) => {
        const connectionManager = { getConnection() {} };
        mockery.registerMock('../../managers/connectionManager', connectionManager);
        // eslint-disable-next-line global-require
        const withActiveConnectionHelper = require('../../../controllers/helpers/withActiveConnection');

        const connectionManagerMock = sandbox.mock(connectionManager);

        connectionManagerMock.expects('getConnection').once()
            .withExactArgs(connection.from).resolves(null);

        withActiveConnectionHelper({}, {}, connection.from, failFun, () => done());
    });

    it('calls connectionManager and returns 500 on connection finding error', (done) => {
        const connectionManager = { getConnection() {} };
        mockery.registerMock('../../managers/connectionManager', connectionManager);
        // eslint-disable-next-line global-require
        const withActiveConnectionHelper = require('../../../controllers/helpers/withActiveConnection');

        const res = { status() {}, send() {} };
        const resMock = sandbox.mock(res);
        const connectionManagerMock = sandbox.mock(connectionManager);

        resMock.expects('status').once().withExactArgs(500);
        resMock.expects('send').once().callsFake(() => done());
        connectionManagerMock.expects('getConnection').once()
            .withExactArgs(connection.from).rejects();

        withActiveConnectionHelper({}, res, connection.from, failFun);
    });
});

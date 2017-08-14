const sinon = require('sinon');
const mockery = require('mockery');
const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const faker = require('faker');

chai.use(chaiAsPromised);
const assert = chai.assert;
const expect = chai.expect;

describe('connectionManager', () => {
    const connection = { from: faker.name.firstName(), to: faker.name.firstName(), remove() {} };
    const resolvingSave = sinon.stub().resolves();
    const namespace = { Connection() { this.save = resolvingSave; } };
    const ConnectionSpy = sinon.spy(namespace, 'Connection');

    mockery.enable({ useCleanCache: true });
    mockery.registerMock('./logger', { debug() {}, error() {} });
    mockery.registerMock('../models/connection', namespace.Connection);
    mockery.registerAllowable('../../managers/connectionManager');
    // eslint-disable-next-line global-require
    const connectionManager = require('../../managers/connectionManager');
    mockery.deregisterAll();
    mockery.disable();

    describe('#connect', () => {
        it('creates and saves both ways', () =>
            connectionManager.connect({ u1: 'okA', u2: 'okB' }).then(() => {
                sinon.assert.calledTwice(resolvingSave);
                sinon.assert.calledTwice(ConnectionSpy);
                sinon.assert.calledWithExactly(ConnectionSpy, { from: 'okA', to: 'okB' });
                sinon.assert.calledWithExactly(ConnectionSpy, { from: 'okB', to: 'okA' });
            }));
    });

    describe('#getConnection', () => {
        it('calls findOne with id and resolves to found connection', () => {
            namespace.Connection.findOne = sinon.stub().resolves(connection);
            const result = connectionManager.getConnection(connection.from);
            expect(result).to.be.a('promise');
            return result.then((resolvedConnection) => {
                assert.deepEqual(resolvedConnection, connection);
                sinon.assert.calledOnce(namespace.Connection.findOne);
                sinon.assert.calledWithExactly(
                    namespace.Connection.findOne,
                    { from: connection.from });
            });
        });
    });

    describe('#deleteConnection', () => {
        it('calls findOne with id and resolves if found', () => {
            namespace.Connection.findOne = sinon.stub().resolves(connection);
            const removeStub = sinon.stub(connection, 'remove').resolves();
            const result = connectionManager.deleteConnection(connection.from);
            expect(result).to.be.a('promise');
            return result.then(() => {
                sinon.assert.calledOnce(namespace.Connection.findOne);
                sinon.assert.calledWithExactly(
                    namespace.Connection.findOne,
                    { from: connection.from });
                sinon.assert.calledOnce(removeStub);
            });
        });

        it('rejects if not found', () => {
            namespace.Connection.findOne = sinon.stub().resolves(null);
            const result = connectionManager.deleteConnection(connection.from);
            expect(result).to.be.a('promise');
            return expect(result).to.eventually.be.rejectedWith('Connection does not exist');
        });
    });
});

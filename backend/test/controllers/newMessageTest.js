const sinon = require('sinon');
const mockery = require('mockery');
const faker = require('faker');

describe('newMessageController', () => {
    const sandbox = sinon.sandbox.create();

    beforeEach(() => {
        mockery.enable({ useCleanCache: true });
        mockery.registerMock('./validators', {});
        mockery.registerMock('./logger', { error: () => {} });
        mockery.registerMock('./helpers/withValidator', (_1, _2, _3, cb) => cb());
        mockery.registerMock('./helpers/withActiveConnection', (_1, _2, _3, cb) => cb());
        mockery.registerAllowable('../../controllers/newMessage');
    });

    afterEach(() => {
        mockery.deregisterAll();
        mockery.disable();
        sandbox.verify();
    });

    it('calls createNewMessage and returns 201 on succesful save', (done) => {
        const messageManager = { createNewMessage: () => {} };
        mockery.registerMock('../managers/messageManager', messageManager);
        // eslint-disable-next-line global-require
        const newMessageHandler = require('../../controllers/newMessage');

        const res = { status() {}, json() {}, send() {} };
        const req = { body: { from: faker.name.firstName(), content: faker.lorem.paragraph() } };
        const resMock = sandbox.mock(res);
        const mockMessageManager = sandbox.mock(messageManager);

        mockMessageManager.expects('createNewMessage').once()
            .withExactArgs({
                from: req.body.from,
                content: req.body.content,
            }).resolves();
        resMock.expects('status').once().withExactArgs(201);
        resMock.expects('send').once().callsFake(() => done());

        newMessageHandler(req, res);
    });

    it('calls createNewMessage and returns 500 on message save fail', (done) => {
        const messageManager = { createNewMessage: () => {} };
        mockery.registerMock('../managers/messageManager', messageManager);
        // eslint-disable-next-line global-require
        const newMessageHandler = require('../../controllers/newMessage');

        const res = { status() {}, json() {}, send() {} };
        const req = { body: { from: faker.name.firstName(), content: faker.lorem.paragraph() } };
        const resMock = sandbox.mock(res);
        const mockMessageManager = sandbox.mock(messageManager);

        mockMessageManager.expects('createNewMessage').once()
            .withExactArgs({
                from: req.body.from,
                content: req.body.content,
            }).rejects();
        resMock.expects('status').once().withExactArgs(500);
        resMock.expects('send').once().callsFake(() => done());

        newMessageHandler(req, res);
    });
});

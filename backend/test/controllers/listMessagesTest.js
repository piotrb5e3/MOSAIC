const sinon = require('sinon');
const mockery = require('mockery');
const faker = require('faker');

function fakeMessageForm(from) {
    return {
        from,
        content: faker.lorem.paragraph(),
        timestamp: faker.date.past(),
    };
}

describe('listMessagesController', () => {
    const sandbox = sinon.sandbox.create();
    const connection = { from: faker.name.firstName(), to: faker.name.firstName() };

    beforeEach(() => {
        mockery.enable({ useCleanCache: true });
        mockery.registerMock('./validators', {});
        mockery.registerMock('./logger', { error: () => {} });
        mockery.registerMock('./helpers/withValidator', (_1, _2, _3, cb) => cb());
        mockery.registerMock('./helpers/withActiveConnection', (_1, _2, _3, cb) => cb(connection));
        mockery.registerAllowable('../../controllers/listMessages');
    });

    afterEach(() => {
        mockery.deregisterAll();
        mockery.disable();
        sandbox.verify();
    });

    it('calls getMessagesFrom for both parties, returns messages and 200 on succes', (done) => {
        const messageManager = { getMessagesFrom: () => {} };
        mockery.registerMock('../managers/messageManager', messageManager);
        // eslint-disable-next-line global-require
        const listMessagesHandler = require('../../controllers/listMessages');

        const req = { body: { code: connection.from } };
        const res = { status() {}, json() {}, send() {} };
        const resMock = sandbox.mock(res);
        const mockMessageManager = sandbox.mock(messageManager);
        const myMessages = [fakeMessageForm(connection.from), fakeMessageForm(connection.from)];
        const strangerMessages = [fakeMessageForm(connection.from)];

        const expectedMessages = myMessages
            .map(o => ({ own: true, content: o.content, timestamp: o.timestamp }))
            .concat(strangerMessages
                .map(o => ({ own: false, content: o.content, timestamp: o.timestamp })));
        mockMessageManager.expects('getMessagesFrom')
            .withExactArgs(connection.from)
            .once()
            .resolves(myMessages);
        mockMessageManager.expects('getMessagesFrom')
            .withExactArgs(connection.to)
            .once()
            .resolves(strangerMessages);

        resMock.expects('status').once().withExactArgs(200);
        resMock.expects('json').once().withExactArgs({ messages: expectedMessages })
            .callsFake(() => done());

        listMessagesHandler(req, res);
    });

    it('calls getMessagesFrom for both parties and returns 500 on find message fail', (done) => {
        const messageManager = { getMessagesFrom: () => {} };
        mockery.registerMock('../managers/messageManager', messageManager);
        // eslint-disable-next-line global-require
        const listMessagesHandler = require('../../controllers/listMessages');

        const req = { body: { code: connection.from } };
        const res = { status() {}, json() {}, send() {} };
        const resMock = sandbox.mock(res);
        const mockMessageManager = sandbox.mock(messageManager);
        const fromFails = faker.random.boolean();

        mockMessageManager.expects('getMessagesFrom')
            .withExactArgs(connection.from)
            .once()
            .returns(fromFails ? Promise.reject() : Promise.resolve([]));
        mockMessageManager.expects('getMessagesFrom')
            .withExactArgs(connection.to)
            .once()
            .returns(fromFails ? Promise.resolve([]) : Promise.reject());

        resMock.expects('status').once().withExactArgs(500);
        resMock.expects('send').once().callsFake(() => done());

        listMessagesHandler(req, res);
    });
});

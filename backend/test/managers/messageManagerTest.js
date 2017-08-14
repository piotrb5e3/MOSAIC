const sinon = require('sinon');
const mockery = require('mockery');
const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const faker = require('faker');

chai.use(chaiAsPromised);
const assert = chai.assert;
const expect = chai.expect;

const user = faker.name.firstName();
const createMessage = () => ({
    from: user,
    timestamp: faker.date.recent(),
    content: faker.lorem.sentences(5),
});

describe('messageManager', () => {
    const message = { from: user, content: faker.lorem.paragraphs(3) };
    const messages = [createMessage(), createMessage(), createMessage(), createMessage()];
    const resolvingSave = sinon.stub().resolves();
    const namespace = { Message() { this.save = resolvingSave; } };
    const MessageSpy = sinon.spy(namespace, 'Message');
    namespace.Message.find = sinon.stub().resolves(messages);

    mockery.enable({ useCleanCache: true });
    mockery.registerMock('./logger', { debug() {}, error() {} });
    mockery.registerMock('../models/message', namespace.Message);
    mockery.registerAllowable('../../managers/messageManager');
    // eslint-disable-next-line global-require
    const messageManager = require('../../managers/messageManager');
    mockery.deregisterAll();
    mockery.disable();
    const startDate = new Date();

    describe('#createNewMessage', () => {
        it('creates and saves', () =>
            messageManager.createNewMessage(message).then(() => {
                sinon.assert.calledOnce(resolvingSave);
                sinon.assert.calledOnce(MessageSpy);
                sinon.assert.calledWithExactly(MessageSpy,
                    {
                        from: message.from,
                        content: message.content,
                        timestamp: sinon.match((value) => {
                            expect(value).to.be.a('date');
                            expect(value).to.be.within(startDate, new Date());
                            return true;
                        }),
                    });
            }));
    });

    describe('#getMessagesFrom', () => {
        it('calls find and filters recvd', () => {
            const expectedMessages = messages.map(
                ({ from, content, timestamp }) => ({ from, content, timestamp }));
            return expect(messageManager.getMessagesFrom(user))
                .to.eventually.deep.equal(expectedMessages)
                .then(() => {
                    sinon.assert.calledWithExactly(namespace.Message.find, { from: user });
                });
        });
    });
});

import { expect } from 'chai';

import * as messageApi from './api';
// extend type Query {
//     messages(cursor: String, limit: Int): MessageConnection!
//     message(id: ID!): Message!
//   }
//   extend type Mutation {
//     createMessage(text: String!): Message!
//     deleteMessage(id: ID!): Boolean!
//     updateMessage(id: ID!, text: String!): Message
//   }
describe('messages', () => {
    describe('message(id: ID!): Message!', () => {
        it('returns a message when message can be found', async () => {
            const expectedResult = {
                data: {
                    message: {
                        id: '1',
                        text: 'Published the Road to learn React',
                    },
                },
            };
            const result = await messageApi.message({ id: '1' });
            expect(result.data).to.eql(expectedResult);
        });

        it('returns an error when message cannot be found', async () => {
            const {
                data: { errors },
            } = await messageApi.message({ id: '42' });
            expect(errors[0].message).to.eql("Cannot return null for non-nullable field Query.message.");
        });
    });

    describe('createMessage(text: String!): Message!', () => {
        it('returns the created message', async () => {
            const expectedResult = {
                data: {
                    createMessage: {
                        text: 'This is a text',
                    },
                },
            };

            const {
                data: {
                    data: {
                        signIn: { token },
                    },
                },
            } = await messageApi.signIn({
                login: 'ddavids',
                password: 'ddavids',
            });
            const result = await messageApi.createMessage({ text: 'This is a text' }, token);
            expect(result.data).to.eql(expectedResult);
        });

        it('returns an error because only authenticated user can create a message', async () => {
            const {
                data: { errors },
            } = await messageApi.createMessage({ text: 'This is a text' }, '');
            expect(errors[0].message).to.eql('Not authenticated as user.');
        });
    });
});
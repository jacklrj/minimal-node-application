import { combineResolvers } from 'graphql-resolvers';
import Sequelize from 'sequelize';

import { isAuthenticated, isMessageOwner } from './authorization';
import pubsub, { EVENTS } from '../subscription';

const toCursorHash = string => Buffer.from(string).toString('base64');

const fromCursorHash = string =>
    Buffer.from(string, 'base64').toString('ascii');

export default {
    Query: {
        messages: async (
            parent,
            { cursor, limit = 100 },
            { models },
        ) => {
            const cursorOptions = cursor
                ? {
                    where: {
                        createdAt: {
                            [Sequelize.Op.lt]: fromCursorHash(cursor),
                        },
                    },
                }
                : {};
            const messages = await models.Message.findAll({
                order: [['createdAt', 'DESC']],
                limit: limit + 1,
                ...cursorOptions,
            });

            const hasNextPage = messages.length > limit;
            const edges = hasNextPage ? messages.slice(0, -1) : messages;

            return {
                edges,
                pageInfo: {
                    hasNextPage,
                    endCursor: toCursorHash(edges[edges.length - 1].createdAt.toString()),
                }
            }
        },

        message: async (parent, { id }, { models }) => {
            return await models.Message.findByPk(id);
        },
    },

    Mutation: {
        createMessage: combineResolvers(
            isAuthenticated,
            async (parent, { text }, { models, me }) => {
                const message = await models.Message.create({
                    text,
                    userId: me.id,
                });

                pubsub.publish(EVENTS.MESSAGE.CREATED, {
                    messageCreated: { message },
                });

                return message;
            },
        ),

        deleteMessage: combineResolvers(
            isAuthenticated,
            isMessageOwner,
            async (parent, { id }, { models }) => {
                return await models.Message.destroy({ where: { id } });
            },
        ),

        updateMessage: combineResolvers(
            isAuthenticated,
            isMessageOwner, async (parent, { id, text }, { models }) => {
                let message = await models.Message.findByPk(id);
                if (message) {
                    message.text = text;
                    message = await message.save();
                }
                return message;
            },
        ),
    },

    Subscription: {
        messageCreated: {
            subscribe: () => pubsub.asyncIterator(EVENTS.MESSAGE.CREATED),
        },
    },

    Message: {
        user: async (message, args, { loaders }) => {
            return await loaders.user.load(message.userId);
        },
    },
};

// import uuidv4 from 'uuid/v4';

// export default {
//     Query: {
//         messages: (parent, args, { models }) => {
//             return Object.values(models.messages);
//         },
//         message: (parent, { id }) => {
//             return messages[id];
//         },
//     },

//     Mutation: {
//         createMessage: (parent, { text }, { me, models }) => {
//             const id = uuidv4();
//             const message = {
//                 id,
//                 text,
//                 userId: me.id,
//             };

//             models.messages[id] = message;
//             models.users[me.id].messageIds.push(id);

//             return message;
//         },

//         deleteMessage: (parent, { id }, { models }) => {
//             const { [id]: message, ...otherMessages } = models.messages;
//             if (!message) {
//                 return false;
//             }
//             models.messages = otherMessages;
//             return true;
//         },

//         updateMessage: (parent, { id, text }) => {
//             const { [id]: message, ...otherMessages } = messages;
//             if (message) {
//                 message.text = text;
//             }
//             console.log(messages);
//             return message;
//         },
//     },

//     Message: {
//         user: (message, args, { models }) => {
//             return models.users[message.userId];
//         },
//     },
// };
export default {
    Query: {
        messages: async (parent, args, { models }) => {
            return await models.Message.findAll();
        },
        message: async (parent, { id }, { models }) => {
            return await models.Message.findByPk(id);
        },
    },
    Mutation: {
        createMessage: async (parent, { text }, { me, models }) => {
            return await models.Message.create({
                text,
                userId: me.id,
            });
        },
        deleteMessage: async (parent, { id }, { models }) => {
            return await models.Message.destroy({ where: { id } });
        },
    },
    Message: {
        user: async (message, args, { models }) => {
            return await models.User.findByPk(message.userId);
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
//             if (!message) {
//                 return false;
//             }
//             message.text = text;
//             console.log(messages);
//             return true;
//         },
//     },

//     Message: {
//         user: (message, args, { models }) => {
//             return models.users[message.userId];
//         },
//     },
// };
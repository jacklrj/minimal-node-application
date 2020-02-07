import uuidv4 from 'uuid/v4';

export default {
    Query: {
        users: async (parent, args, { models }) => {
            return await models.User.findAll();
        },
        user: async (parent, { id }, { models }) => {
            return await models.User.findByPk(id);
        },
        me: async (parent, args, { models, me }) => {
            return await models.User.findByPk(me.id);
        },
    },
    User: {
        messages: async (user, args, { models }) => {
            return await models.Message.findAll({
                where: {
                    userId: user.id,
                },
            });
        },
    },
};

// import uuidv4 from 'uuid/v4';

// export default {
//     Query: {
//         users: (parent, args, { models }) => {
//             return Object.values(models.users);
//         },
//         user: (parent, { id }, { models }) => {
//             return models.users[id];
//         },
//         me: (parent, args, { me }) => {
//             return me;
//         },
//     },

//     User: {
//         username: user => `${user.firstname} ${user.lastname}`,
//         messages: (user, args, { models }) => {
//             return Object.values(models.messages).filter(
//                 message => message.userId === user.id,
//             );
//         },
//     },
// };
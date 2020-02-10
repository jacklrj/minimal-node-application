import uuidv4 from 'uuid/v4';
import jwt from 'jsonwebtoken';
import { AuthenticationError, UserInputError } from 'apollo-server';

const createToken = async (user, secret, expiresIn) => {
    const { id, email, username } = user;
    return await jwt.sign({ id, email, username }, secret, {
        expiresIn,
    });
};

export default {
    Query: {
        users: async (parent, args, { models }) => {
            return await models.User.findAll();
        },

        user: async (parent, { id }, { models }) => {
            return await models.User.findByPk(id);
        },

        me: async (parent, args, { models, me }) => {
            if (!me) {
                return null;
            }
            return await models.User.findByPk(me.id);
        },
    },

    Mutation: {
        signUp: async (
            parent,
            { username, email, password },
            { models, secret },
        ) => {
            const user = await models.User.create({
                username,
                email,
                password,
            });
            return { token: createToken(user, secret, '30m') };
        },

        signIn: async (
            parent,
            { login, password },
            { models, secret },
        ) => {
            const user = await models.User.findByLogin(login);
            if (!user) {
                throw new UserInputError(
                    'No user found with this login credentials.',
                );
            }
            const isValid = await user.validatePassword(password);
            if (!isValid) {
                throw new AuthenticationError('Invalid password.');
            }
            return { token: createToken(user, secret, '30m') };
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
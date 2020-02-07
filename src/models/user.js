const user = (sequelize, DataTypes) => {
    const User = sequelize.define('user', {
        username: {
            type: DataTypes.STRING,
        },
    });
    User.associate = models => {
        User.hasMany(models.Message, { onDelete: 'CASCADE' });
    };

    User.findByLogin = async login => {
        let user = await User.findOne({
            where: { username: login },
        });
        if (!user) {
            user = await User.findOne({
                where: { email: login },
            });
        }
        return user;
    };

    return User;
};
export default user;

// let users = {
//     1: {
//         id: '1',
//         firstname: 'Robin',
//         lastname: 'Wieruch',
//         messageIds: [1],
//     },
//     2: {
//         id: '2',
//         firstname: 'Dave',
//         lastname: 'Davids',
//         messageIds: [2],
//     },
// };

// let messages = {
//     1: {
//         id: '1',
//         text: 'Hello World',
//         userId: '1',
//     },
//     2: {
//         id: '2',
//         text: 'By World',
//         userId: '2',
//     },
// };

// export default {
//     users,
//     messages,
// };
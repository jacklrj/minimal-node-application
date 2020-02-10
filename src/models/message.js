const message = (sequelize, DataTypes) => {
    const Message = sequelize.define('message', {
        text: {
            type: DataTypes.STRING,
            validate: {
                notEmpty: {
                    args: true,
                    msg: 'A message has to have a text.',
                },
            },
        },
    });
    Message.associate = models => {
        Message.belongsTo(models.User);
    };
    return Message;
};
export default message;

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
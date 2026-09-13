module.exports = (sequelize, DataTypes) => {
    const UserConversation = sequelize.define('UserConversation', {
        userId: {
            type: DataTypes.INTEGER,
            references: { model: "Users", key: 'id' },
            allowNull: false,
            validate: {
                notEmpty: true
            }
        },
        conversationId: {
            type: DataTypes.INTEGER,
            references: { model: "Conversations", key: 'id' },
            allowNull: false,
            validate: {
                notEmpty: true
            }
        }
    })
    return UserConversation
}
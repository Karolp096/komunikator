const Conversation = require("./Conversation")

module.exports = (sequelize, DataTypes) => {
    const Message = sequelize.define("Message", {
        message: {
            type: DataTypes.STRING,
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
        },
        senderId: {
            type: DataTypes.INTEGER,
            references: { model: 'Users', key: 'id' },
            allowNull: false,
            validate: {
                notEmpty: true
            }
        }
    })
    return Message
}
const { Model } = require("sequelize")
const Message = require("./Message")
const User = require("./User")

module.exports = (sequelize, DataTypes) => {
    const Conversation = sequelize.define("Conversation", {
        name: {
            type: DataTypes.STRING
        }
    })
    return Conversation
}
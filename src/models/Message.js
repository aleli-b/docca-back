const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    sequelize.define(
        'message',
        {
            id: {
                type: DataTypes.UUID,
                allowNull: false,
                primaryKey: true,
                defaultValue: DataTypes.UUIDV4,
            },
            content: {
                type: DataTypes.TEXT,
                allowNull: false,
            },
            conversationId: {
                type: DataTypes.UUID,
                allowNull: false,
            },
            senderId: {
                type: DataTypes.UUID,
                allowNull: false,
            },
            receiverId: {
                type: DataTypes.UUID,
                allowNull: false,
            },
            isRead: {
                type: DataTypes.BOOLEAN,
                defaultValue: false,
            },
        },
        {
            timestamps: true,
        }
    );
};
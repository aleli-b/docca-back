// models/conversation.js

const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  sequelize.define(
    'conversation',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull:false,
      },
      participant1Id: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      participant2Id: {
        type: DataTypes.UUID,
        allowNull: false,
      },
    },
    {
      timestamps: false,
    }
  );
};
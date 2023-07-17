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
      // Make sure to use DataTypes.UUID for participant1Id and participant2Id
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
const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  sequelize.define(
    "pago",
    {
      id: {
        type: DataTypes.UUID,
        allowNull: false,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
      },
      turnoId: {
        type: DataTypes.UUID,
        allowNull: true,
      },
    },
    {
      timestamps: true,
    }
  );
};

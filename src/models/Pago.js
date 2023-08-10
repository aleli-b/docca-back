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
      // userId: {
      //   type: DataTypes.UUID,
      //   allowNull: false,
      //   defaultValue: DataTypes.UUIDV4,
      // },
      // doctorId: {
      //   type: DataTypes.UUID,
      //   allowNull: false,
      //   defaultValue: DataTypes.UUIDV4,
      // },
    },
    {
      timestamps: true,
    }
  );
};

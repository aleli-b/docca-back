const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    sequelize.define(
        'pago',
        {
            idPagoMP:{
                type: DataTypes.INTEGER,
                allowNull: false,
                primaryKey: true,
                defaultValue: DataTypes.INTEGER,
            },
            userId:{
                type: DataTypes.UUID,
                allowNull: false,                
                defaultValue: DataTypes.UUIDV4,
            },
            doctorId:{
                type: DataTypes.UUID,
                allowNull: false,                
                defaultValue: DataTypes.UUIDV4,
            },
        },
        {
            timestamps: true
        }
    );
};

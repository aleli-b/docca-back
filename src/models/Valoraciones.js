const { DataTypes, INTEGER } = require('sequelize');

module.exports = (sequelize) => {
    sequelize.define(
        'valoraciones',
        {
            id: {
                type: DataTypes.UUID,
                allowNull: false,
                primaryKey: true,
                defaultValue: DataTypes.UUIDV4,
            },
            userId: {
                type: DataTypes.UUID,
                allowNull: false,                
                defaultValue: DataTypes.UUIDV4,
            },
            doctorId: {
                type: DataTypes.UUID,
                allowNull: false,                
                defaultValue: DataTypes.UUIDV4,
            },
            valoracion:{
                type: DataTypes.INTEGER,
                allowNull:false,
                defaultValue: DataTypes.INTEGER

            }
        },
        {
            timestamps: true
        }
    );
};

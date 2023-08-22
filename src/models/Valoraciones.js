const { DataTypes, INTEGER } = require('sequelize');

module.exports = (sequelize) => {
    sequelize.define(
        'valoraciones',
        {
            turnoId: {
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
                primaryKey: true,
                allowNull:false,
                defaultValue: 0

            },
            reseña:{
                type: DataTypes.STRING,
                allowNull:false,
            }
        },
        {
            timestamps: true
        }
    );
};

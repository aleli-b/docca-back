const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    sequelize.define(
        'user',
        {
            id: {
                type: DataTypes.UUID,
                allowNull: false,
                primaryKey: true,
                defaultValue: DataTypes.UUIDV4,
            },
            name: {
                type: DataTypes.STRING,
                allowNull: false,                
            },
            lastName: {
                type: DataTypes.STRING,
                allowNull: false,                
            },
            age: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            email: {
                type: DataTypes.STRING,
                allowNull: false,
                unique: true,
                validate: {
                    isEmail: true,
                },
            },
            password: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            banned: {
                type: DataTypes.BOOLEAN,
                defaultValue: false,
            },
            admin: {
                type: DataTypes.BOOLEAN,
                defaultValue: false,
            },
            emailVerified: {
                type: DataTypes.BOOLEAN,
                defaultValue: false,
            },
            userType: {
                type: DataTypes.ENUM('doctor', 'patient', 'lab'),
                allowNull: false,
                defaultValue: 'patient',
            }, 
            category: {
                type: DataTypes.ENUM('otorrinolaringologo', 'odontologo', 'endocrinologo', 'infectologo', 'cardiologo'),
                allowNull: true,
                defaultValue: null,
            }           
        },
        {
            timestamps: false
        }
    );
};

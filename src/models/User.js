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
            phone: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            adress: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            description: {
                type: DataTypes.STRING,
                allowNull: true,
                validate: {
                    len: {
                        args: [27],
                        msg: 'la descripcion es muy corta'
                    }
                }
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
                type: DataTypes.ENUM('Otorrinolaringólogo', 'Odontólogo', 'Endocrinólogo', 'Infectólogo', 'Cardiólogo', 'Ortopédico', 'Dermatólogo', 'Estilo de Vida'),
                allowNull: true,
                defaultValue: null,
            },
            price: {
                type: DataTypes.INTEGER,
                allowNull: true,
                defaultValue: null,
            },
            lab_category: {
                type: DataTypes.ENUM('bioquimico', 'radiografia', 'tomografia',),
                allowNull: true,
                defaultValue: null,
            },
            profile_picture_url: { 
                type: DataTypes.STRING, 
                allowNull: true, 
            },
        },
        {
            timestamps: false
        }
    );
};

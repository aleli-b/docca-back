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
                type: DataTypes.STRING,
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
            country: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            state: {
                type: DataTypes.STRING,
                allowNull: false,
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
            price: {
                type: DataTypes.INTEGER,
                allowNull: true,
            },
            clabe: {
                type: DataTypes.BIGINT,
                allowNull: true,
            },
            subscription: {
                type: DataTypes.BOOLEAN,
                defaultValue: false,
            },
            cedulaVerified: {
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
                type: DataTypes.ENUM(
                    'Anestesiología',
                    'Cardiología',
                    'Cardiólogo',
                    'Cirugía',
                    'Dermatología',
                    'Endocrinología',
                    'Endocrinólogo',
                    'Gastroenterología',
                    'Gineco obstetricia',
                    'Infectología',
                    'Infectólogo',
                    'Medicina Familiar',
                    'Medicina General',
                    'Medicina Intensiva',
                    'Medicina del Estilo de Vida',
                    'Medicina física y rehabilitación',
                    'Médicina Interna',
                    'Neumología',
                    'Neurología',
                    'Nefrología',
                    'Oftalmología',
                    'Oncología',
                    'Ortopédico',
                    'Otorrinolaringología',
                    'Otorrinolaringólogo',
                    'Odontólogo',
                    'Patología',
                    'Pediatría',
                    'Psiquiatría',
                    'Radiología',
                    'Urología',
                ),
                allowNull: true,
                defaultValue: null,
            },
            price: {
                type: DataTypes.INTEGER,
                allowNull: true,
                defaultValue: null,
            },
            startTime: {
                type: DataTypes.STRING,
                allowNull: true,
                defaultValue: null,
            },
            endTime: {
                type: DataTypes.STRING,
                allowNull: true,
                defaultValue: null,
            },
            interval: {
                type: DataTypes.STRING,
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
            cedula_url: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            resetTokenId: DataTypes.STRING, // Add a new column for the resetTokenId
            resetTokenData: DataTypes.STRING,
        },
        {
            timestamps: false
        }
    );
};

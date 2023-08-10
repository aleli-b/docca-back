require("dotenv").config();
const { Sequelize } = require("sequelize");
const fs = require("fs");
const path = require("path");
const { DB_USER, DB_PASSWORD, DB_HOST, DB_NAME, DB_PORT } = process.env;

let sequelize =
  process.env.NODE_ENV === "production"
    ? new Sequelize({
        database: DB_NAME,
        dialect: "postgres",
        host: DB_HOST,
        port: DB_PORT,
        username: DB_USER,
        password: DB_PASSWORD,
        pool: {
          max: 3,
          min: 1,
          idle: 10000,
        },
        dialectOptions: {
          ssl: {
            require: true,
            rejectUnauthorized: false,
          },
          keepAlive: true,
        },
        ssl: true,
      })
    : new Sequelize(
        `postgres://${DB_USER}:${DB_PASSWORD}@${DB_HOST}/${DB_NAME}`, //DB NAME countries
        { logging: false, native: false }
      );

const basename = path.basename(__filename);

const modelDefiners = [];

fs.readdirSync(path.join(__dirname, "/models"))
  .filter(
    (file) =>
      file.indexOf(".") !== 0 && file !== basename && file.slice(-3) === ".js"
  )
  .forEach((file) => {
    modelDefiners.push(require(path.join(__dirname, "/models", file)));
  });

modelDefiners.forEach((model) => model(sequelize));

let entries = Object.entries(sequelize.models);
let capsEntries = entries.map((entry) => [
  entry[0][0].toUpperCase() + entry[0].slice(1),
  entry[1],
]);
sequelize.models = Object.fromEntries(capsEntries);

const { User, Turno, Message, Conversation, Labtest, Pago, Valoraciones } =
  sequelize.models;

User.hasMany(Turno, { as: "turno", foreignKey: "userId" });
Turno.belongsTo(User, { as: "doctor", foreignKey: "doctorId" });
Turno.belongsTo(User, { as: "paciente", foreignKey: "userId" });

User.hasMany(Message, { as: "sentMessages", foreignKey: "senderId" });
User.hasMany(Message, { as: "receivedMessages", foreignKey: "receiverId" });

Message.belongsTo(User, { as: "sender", foreignKey: "senderId" });
Message.belongsTo(User, { as: "receiver", foreignKey: "receiverId" });

Conversation.hasMany(Message, { as: "messages", foreignKey: "conversationId" });
Message.belongsTo(Conversation, {
  as: "conversation",
  foreignKey: "conversationId",
});

Conversation.belongsTo(User, {
  foreignKey: "participant1Id",
  as: "participant1",
});

Conversation.belongsTo(User, {
  foreignKey: "participant2Id",
  as: "participant2",
});

User.hasMany(Conversation, {
  foreignKey: "participant1Id",
  as: "participant1Conversations",
});

User.hasMany(Conversation, {
  foreignKey: "participant2Id",
  as: "participant2Conversations",
});

User.hasMany(Labtest, {
  foreignKey: "doctorId",
  as: "doctorLabtests",
});

User.hasMany(Labtest, {
  foreignKey: "labId",
  as: "labLabtests",
});

User.hasMany(Labtest, {
  foreignKey: "userId",
  as: "patientLabtests",
});

Labtest.belongsTo(User, {
  foreignKey: "doctorId",
  as: "labtestDoctor",
});

Labtest.belongsTo(User, {
  foreignKey: "labId",
  as: "labtestLab",
});

Labtest.belongsTo(User, {
  foreignKey: "userId",
  as: "labtestPatient",
});

// User.hasMany(Pago, {
//   foreignKey: "userId",
//   as: "patientPayer",
// });

// User.hasMany(Pago, {
//   foreignKey: "doctorId",
//   as: "doctorPaid",
// });

// Pago.belongsTo(User, {
//   foreignKey: "userId",
//   as: "payerPatient",
// });

// Pago.belongsTo(User, {
//   foreignKey: "doctorId",
//   as: "paidDoctor",
// });

Pago.belongsTo(Turno, {
  foreignKey: "turnoId",
  as: "turnoPay",
});

Turno.hasOne(Pago, {
  foreignKey: "turnoId",
  as: "payTurno",
});



module.exports = {
  ...sequelize.models,
  db: sequelize,
};

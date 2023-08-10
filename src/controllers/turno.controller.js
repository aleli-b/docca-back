require("dotenv").config({ path: "./.env" });
const moment = require("moment-timezone");
const cron = require("node-cron");
const { Turno, User } = require("../db");
const { Op } = require("sequelize");

async function getOccupiedTurnos(req, res) {
  try {
    const turnoDB = await Turno.findAll({});
    return res.status(200).json(turnoDB);
  } catch (error) {
    console.log(error);
    res.status(400).send("Ha habido un error.");
  }
}

async function addTurno(userData) {
  const { date, userId, doctorId } = userData;
  console.log("primera", date);
  console.log(userId, doctorId);
  try {
    const pacienteHasTurno = await Turno.findOne({
      where: { userId },
      include: "paciente",
    });
    const doctorCheck = await Turno.findOne({
      where: { doctorId },
      include: "doctor",
    });

    if (doctorCheck && date === doctorCheck.date) {
      console.log("The Doctor already has a turno");
      return("The Doctor already has a turno");
    }

    if (pacienteHasTurno) {
      console.log("The User already has a turno");
      return("The User already has a turno");
    }

    const turno = await Turno.create({ date, userId, doctorId });
    return(turno.id);
  } catch (error) {
    // console.error(error);
    return("Error creating turno");
  }
}

async function getPacienteTurno(req, res) {
  try {
    const { userId } = req.body;
    const turno = await Turno.findAll({
      where: { userId },
      include: [
        {
          model: User,
          as: "doctor",
          attributes: { exclude: ["password"] },
        },
      ],
    });

    if (!turno) return res.status(404).send("chpalabola");
    return res.status(200).send(turno);
  } catch (error) {
    console.log(error);
    res.status(400).send("Ha habido un error");
  }
}

async function getDoctorTurno(req, res) {
  try {
    const { doctorId } = req.body;
    const turno = await Turno.findAll({
      where: { doctorId },
      include: [
        {
          model: User,
          as: "paciente",
          attributes: { exclude: ["password"] },
        },
      ],
    });

    if (!turno) return res.status(404).send("chpalabola");
    return res.status(200).send(turno);
  } catch (error) {
    console.log(error);
    res.status(400).send("Ha habido un error");
  }
}

async function deletePastTurnos(dateString) {
  try {
    const currentDateUTC = moment.utc(dateString, "YYYY-MM-DD HH:mm").toDate();

    const deletedTurnos = await Turno.destroy({
      where: {
        date: {
          [Op.lt]: currentDateUTC,
        },
      },
    });

    console.log(`Deleted ${deletedTurnos} past turnos at ${currentDateUTC}`);
  } catch (error) {
    console.error(error);
  }
}
cron.schedule("0 0 * * *", deletePastTurnos);

module.exports = {
  getOccupiedTurnos,
  addTurno,
  getPacienteTurno,
  getDoctorTurno,
};
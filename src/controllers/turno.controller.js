require('dotenv').config({ path: './.env' });
const moment = require('moment');
const { Turno, User } = require('../db');

async function getTurnos(req, res) {
  const turnoDB = await Turno.findAll();
  console.log(turnoDB)
  return res.status(200).json(turnoDB)
}

async function getOccupiedTurnos(req, res) {
  try {
    
    const turnoDB = await Turno.findAll({ });
    return res.status(200).json(turnoDB);
  } catch (error) {
    console.log(error);
    res.status(400).send('Ha habido un error.')
  }
}

async function addTurno(req, res) {
  const { date, userId, doctorId } = req.body;
  try {
    console.log(userId, doctorId);
    const pacienteHasTurno = await Turno.findOne({ where: { userId }, include: 'paciente' });
    const doctorCheck = await Turno.findOne({ where: { doctorId }, include: 'doctor' });

    if (doctorCheck && date === doctorCheck.date) {
      console.log('The Doctor already has a turno');
      return res.status(401).send('The Doctor already has a turno');
    }

    if (pacienteHasTurno) {
      console.log('The User already has a turno');
      return res.status(400).send('The User already has a turno');
    }

    const formattedDate = moment(date, 'D [de] MMMM HH:mm').format('YYYY-MM-DD HH:mm');
    const turno = await Turno.create({ date: formattedDate, userId, doctorId });
    res.send({ turno });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error creating turno');
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
          as: 'doctor',
          attributes: { exclude: ['password'] }
        }
      ]
    });

    if (!turno) return res.status(404).send('chpalabola')
    return res.status(200).send(turno)
  } catch (error) {
    console.log(error);
    res.status(400).send('Ha habido un error')
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
          as: 'paciente',
          attributes: { exclude: ['password'] }
        }
      ]
    });

    if (!turno) return res.status(404).send('chpalabola')
    return res.status(200).send(turno)
  } catch (error) {
    console.log(error);
    res.status(400).send('Ha habido un error')
  }
}

module.exports = {
  getTurnos,
  getOccupiedTurnos,
  addTurno,
  getPacienteTurno,
  getDoctorTurno
}
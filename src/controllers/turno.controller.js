require('dotenv').config({ path: './.env' });
const moment = require('moment');
const { Turno } = require('../db');

async function getTurnos(req, res) {
  const turnoDB = await Turno.findAll();
  console.log(turnoDB)
  return res.status(200).json(turnoDB)
}

async function getOccupiedTurnos(req, res) {
  const { doctorId } = req.body;
  const turnoDB = await Turno.findAll({where: { doctorId }, include: 'doctor'});  
  return res.status(200).json(turnoDB);
}


async function addTurno(req, res) {
  const { date, userId, doctorId } = req.body;
  try {
    console.log(userId, doctorId);
    const pacienteHasTurno = await Turno.findOne({ where: { userId }, include: 'paciente' });
    const doctorHasTurno = await Turno.findOne({ where: { doctorId }, include: 'doctor' });
    
    if (pacienteHasTurno) {
      console.log('The User already has a turno');
      return res.status(400).send('The User already has a turno');
    }

    if (doctorHasTurno) {
      console.log('The Doctor already has a turno');
      return res.status(400).send('The Doctor already has a turno');
    }
    
    const formattedDate = moment(date, 'D [de] MMMM HH:mm').format('YYYY-MM-DD HH:mm');
    console.log(formattedDate)
    const turno = await Turno.create({ date: formattedDate, userId, doctorId });
    res.send({ turno });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error creating turno');
  }
}



const getTurnoWithUser = async (req, res) => {
  try {
    const turnoId = req.body.turnoId;
    const turno = await Turno.findByPk(turnoId, { include: 'paciente' });

    if (!turno) {
      console.log('Turno not found');
      res.status(404).send('Turno no encontrado')
      return;
    }

    const user = turno.paciente;

    console.log('Turno:', turno.toJSON());
    console.log('User:', user.toJSON());
    res.send('este es el turno con fecha y hora ' + turno.date + ' de ' + user.username)
  } catch (error) {
    console.error('Error retrieving turno:', error);
    res.status(400).send('Ha habido un error')
  }
};

module.exports = {
  getTurnos,
  getOccupiedTurnos,
  addTurno,
  getTurnoWithUser
}
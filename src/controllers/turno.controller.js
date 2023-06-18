require('dotenv').config({ path: './.env' });
const { Turno } = require('../db');

async function addTurno(req, res) {
    const { date, userId } = req.body;
    try {
      const existingTurno = await Turno.findOne({ where: { userId }, include: 'paciente' });
      if(existingTurno.paciente.userType === 'doctor') return res.status(400).send('Los doctores no pueden sacar turno')
      if (existingTurno) {
        console.log('A turno already exists for the user');
        return res.status(400).send('A turno already exists for the user');
      }
    
      const turno = await Turno.create({ date, userId });      
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
    addTurno,
    getTurnoWithUser
}
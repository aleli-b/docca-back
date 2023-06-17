require('dotenv').config({ path: './.env' });
const { Turno } = require('../db');

async function addTurno(req, res) {
    const { date, userId } = req.body;
    try {
      const existingTurno = await Turno.findOne({ where: { userId } });
      
      if (existingTurno) {
        console.log('A turno already exists for the user');
        return res.status(400).send('A turno already exists for the user');
      }
    
      const turno = await Turno.create({ date, userId });
      console.log(turno);
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
            return;
        }

        const user = turno.paciente;

        console.log('Turno:', turno.toJSON());
        console.log('User:', user.toJSON());
        res.send('este es el turno ' + turno.id + ' de ' + user.username)
    } catch (error) {
        console.error('Error retrieving turno:', error);
        res.status(400).send('Ha habido un error')
    }
};

module.exports = {
    addTurno,
    getTurnoWithUser
}
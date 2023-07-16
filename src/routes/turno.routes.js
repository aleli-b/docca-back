const { Router } = require('express');
const router = Router();
const turnoController = require('../controllers/turno.controller');
const jwtVerify = require('../middlewares/isAuth')

router.post('/turnos', jwtVerify , turnoController.addTurno)

router.post('/turnos-ocupados', /* jwtVerify, */ turnoController.getOccupiedTurnos)

router.post('/user-turnos', /* jwtVerify, */ turnoController.getPacienteTurno)

router.post('/doctor-turnos', /* jwtVerify, */ turnoController.getDoctorTurno)

router.get('/turnos', jwtVerify , turnoController.getTurnos)

module.exports = router;
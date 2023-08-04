const { Router } = require('express');
const router = Router();
const turnoController = require('../controllers/turno.controller');
const jwtVerify = require('../middlewares/isAuth')

// router.post('/turnos', jwtVerify , turnoController.addTurno)

router.get('/turnos-ocupados', /* jwtVerify, */ turnoController.getOccupiedTurnos)

router.post('/user-turnos', /* jwtVerify, */ turnoController.getPacienteTurno)

router.post('/doctor-turnos', /* jwtVerify, */ turnoController.getDoctorTurno)

module.exports = router;
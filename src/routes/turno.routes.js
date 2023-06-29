const { Router } = require('express');
const router = Router();
const turnoController = require('../controllers/turno.controller');
const jwtVerify = require('../middlewares/isAuth')

router.post('/turnos', jwtVerify , turnoController.addTurno)

router.get('/user-turnos', jwtVerify , turnoController.getTurnoWithUser)

router.get('/turnos', jwtVerify , turnoController.getTurnos)

module.exports = router;
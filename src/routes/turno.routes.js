const { Router } = require('express');
const router = Router();
const turnoController = require('../controllers/turno.controller');
const jwtVerify = require('../middlewares/isAuth')

router.post('/turnos', jwtVerify , turnoController.addTurno)

router.get('/turnos', jwtVerify , turnoController.getTurnoWithUser)

module.exports = router;
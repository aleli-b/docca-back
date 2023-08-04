const { Router } = require('express');
const router = Router();
const mpController = require('../controllers/valoraciones.controller');
const jwtVerify = require('../middlewares/isAuth')

router.post('/mpcheckout', mpController.setValoracion)
router.get('/feedbackSubscription', /*jwtVerify*/ mpController.getValoracion)


module.exports = router;
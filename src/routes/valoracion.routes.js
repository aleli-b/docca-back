const { Router } = require('express');
const router = Router();
const valoracionesController = require('../controllers/valoraciones.controller');
const jwtVerify = require('../middlewares/isAuth')

router.post('/setValoration/', valoracionesController.setValoration)
router.post('/getValoration', /*jwtVerify*/ valoracionesController.getValoration)


module.exports = router;
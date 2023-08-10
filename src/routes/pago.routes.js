const { Router } = require('express');
const router = Router();
const pagoController = require('../controllers/pagos.controller');
const jwtVerify = require('../middlewares/isAuth')

router.get('/pagos/:pagoId', /*jwtVerify*/ pagoController.getPago)


module.exports = router;
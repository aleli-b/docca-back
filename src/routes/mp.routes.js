const { Router } = require('express');
const router = Router();
const mpController = require('../controllers/mp.controller');
const jwtVerify = require('../middlewares/isAuth')

router.post('/mpcheckout', /*jwtVerify*/ mpController.setPreferences)
router.get('/feedback', /*jwtVerify*/ mpController.feedback)


module.exports = router;
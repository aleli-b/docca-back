const { Router } = require('express');
const router = Router();
const mpController = require('../controllers/mp.controller');
const jwtVerify = require('../middlewares/isAuth')

router.post('/mpcheckout', /*jwtVerify*/ mpController.setPreferences)
router.post('/mpcheckoutSubscription', /*jwtVerify*/ mpController.setPreferencesSubscription)
router.get('/feedback', /*jwtVerify*/ mpController.feedback)
router.get('/feedbackSubscription', /*jwtVerify*/ mpController.feedbackSubscription)


module.exports = router;
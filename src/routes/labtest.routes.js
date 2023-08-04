const { Router } = require('express');
const router = Router();
const labtestController = require('../controllers/labtest.controller');
const jwtVerify = require('../middlewares/isAuth');

router.get('/labtests')

module.exports = router;

const { Router } = require('express');
const router = Router();
const userController = require('../controllers/user.controller');

router.post('/users', userController.addUser)

router.post('/login', userController.login)

module.exports = router;
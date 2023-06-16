const { Router } = require('express');
const router = Router();
const userController = require('../controllers/user.controller');

router.post('/users', userController.addUser)

module.exports = router;
const { Router } = require('express');
const router = Router();
const userController = require('../controllers/user.controller');

router.get('/users', userController.getUsers)

router.get('/users/categories/:category', userController.getUsersByCategory);

router.post('/users', userController.addUser)

router.patch('/users/:id', userController.banUser)

router.post('/login', userController.login)

module.exports = router;
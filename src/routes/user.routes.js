const { Router } = require('express');
const router = Router();
const jwtVerify = require('../middlewares/isAuth.js')
const userController = require('../controllers/user.controller');

router.get('/users', userController.getUsers)

router.get('/doctors', userController.getDoctors)

router.get('/users/categories/:category', userController.getUsersByCategory);

router.post('/users', userController.addUser)

router.patch('/users/:id/', jwtVerify, userController.updateUser)

router.patch('/users/:id/ban', userController.banUser)

router.post('/login', userController.login)

module.exports = router;
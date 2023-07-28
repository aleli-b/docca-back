const { Router } = require('express');
const router = Router();
const jwtVerify = require('../middlewares/isAuth.js')
const userController = require('../controllers/user.controller');

router.get('/users', userController.getUsers);

router.get('/user/:id', userController.getUser);

router.get('/doctors', userController.getDoctors);

router.get('/labs', userController.getLabs);

router.get('/users/categories/:category', userController.getUsersByCategory);

router.post('/users', userController.addUser);

router.patch('/users/:id/', jwtVerify, userController.updateUser);

router.patch('/users/:id/ban', userController.banUser);

router.post('/login', userController.login);

router.post('/forgot-password', userController.forgotPassword);

module.exports = router;
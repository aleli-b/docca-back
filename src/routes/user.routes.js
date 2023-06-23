const { Router } = require('express');
const router = Router();
const userController = require('../controllers/user.controller');

router.get('/users', userController.getUsers)

router.get('/users/categories/:category', userController.getUsersByCategory);

router.post('/users', userController.addUser)

router.delete('/users/:id', userController.delUser)

router.post('/login', userController.login)

module.exports = router;
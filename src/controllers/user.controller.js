require('dotenv').config({ path: './.env' });
const { User } = require('../db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const secret = process.env.SECRET_KEY;
const saltRounds = 5;

async function addUser(req, res) {
    let username = req.body.username;
    let email = req.body.email;
    let password = req.body.password;
    let userType = req.body.userType;

    try {
        const userToSave = new User({
            username: username,
            email: email,
            password: password,
            userType: userType,
        })

        userToSave.username = userToSave.username?.toLowerCase();
        userToSave.email = userToSave.email?.toLowerCase();

        const checkUsername = await User.findOne({ where: { username: userToSave.username } });
        const checkEmail = await User.findOne({ where: { email: userToSave.email } });
        if (checkUsername || checkEmail) return res.status(401).send("email o usuario en uso");

        const hash = await bcrypt.hash(password, saltRounds);
        userToSave.password = hash;

        const userSaved = await userToSave.save();

        userSaved.password = undefined;

        return res.send({
            msg: 'Creacion exitosa',
            user: userSaved,
            ok: true,
        });

    } catch (error) {
        console.log(error)
        res.status(400).send({
            msg: 'No se pudo guardar el usuario',
            ok: false
        });
    }
}

async function login(req, res) {
    try {
        const email = req.body.email;
        const password = req.body.password;

        const user = await User.findOne({ where: { email: email } });

        if (!user) return res.status(404).send({
            msg: "Usuario no encontrado",
            ok: false
        })

        const result = await bcrypt.compare(password, user.password);

        if (!result) {
            return res.status(404).send({
                msg: 'Login incorrecto',
                ok: false
            })
        }

        const token = jwt.sign(user.toJSON(), secret, { expiresIn: '2h' });

        if (user) return res.status(200).send({
            msg: 'Login exitoso',
            ok: true,
            token,
            user
        })

    } catch (error) {
        console.log(error)
        res.status(400).send({
            msg: "Error al loguearse",
            ok: false
        })
    }
}

module.exports = {
    addUser,
    login
}
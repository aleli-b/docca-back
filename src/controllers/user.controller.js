const { User } = require('../db');
const bcrypt = require('bcrypt');
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

        const checkUser = await User.findOne({ where: { email: userToSave.email, username: userToSave.username } });
        if (checkUser) return res.status(400).send("User en uso");

        const hash = await bcrypt.hash(password, saltRounds);
        userToSave.password = hash;

        const userSaved = await userToSave.save();

        userSaved.password = undefined;

        return res.send({
            msg: 'Creacion exitosa',
            ok: true,
            user: userSaved
        });

    } catch (error) {
        console.log(error)
        res.send({
            msg: 'No se pudo guardar el usuario',
            ok: false
        });
    }
}

module.exports = {
    addUser
}
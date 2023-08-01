require('dotenv').config({ path: './.env' });
const { User } = require('../db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const secret = process.env.SECRET_KEY;
const saltRounds = 5;
const { v4: uuidv4 } = require('uuid');
const upload = require('../utils/cloudinary');
const transporter = require('../utils/mailer');

async function getUsers(req, res) {
    const userDB = await User.findAll({
        attributes: {
            exclude: ['password']
        }
    });
    return res.status(200).json(userDB);
}

async function getUser(req, res) {
    try {
        const id = req.params.id
        const user = await User.findOne({
            where: {
                id: id,
            }
        })
        return res.status(200).send(user);
    } catch (error) {
        console.log(error);
        return res.status(400).send('Ha habido un error')
    }
}

async function getDoctors(req, res) {
    const userDB = await User.findAll({
        where: {
            userType: 'doctor'
        }
    });
    return res.status(200).json(userDB)
}

async function getLabs(req, res) {
    const userDB = await User.findAll({
        where: {
            userType: 'lab'
        }
    });
    console.log(userDB)
    return res.status(200).json(userDB)
}

async function getUsersByCategory(req, res) {
    try {
        const category = req.params.category;
        const users = await User.findAll({
            where: {
                category: category,
            },
        });

        if (!users) {
            return res.status(200).json({ error: `No se encontraron usuarios en la categoría ${category}` });
        }

        res.status(200).json(users);
    } catch (error) {
        console.log(error)
        res.status(400).send({ ok: false })
    }
}

async function addUser(req, res) {
    let name = req.body.name;
    let lastName = req.body.lastName;
    let age = req.body.age;
    let email = req.body.email;
    let password = req.body.password;
    let userType = req.body.userType;
    let category = req.body.category;
    let lab_category = req.body.lab_category;
    let banned = req.body.banned || false;

    try {
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
        if (!password.match(passwordRegex)) {
            return res.status(400).send('La contraseña debe tener al menos 8 caracteres, incluyendo una letra mayúscula y un número.');
        }

        const userToSave = new User({
            name: name,
            lastName: lastName,
            age: age,
            email: email,
            password: password,
            userType: userType,
            category: category,
            lab_category: lab_category,
            banned: banned,
        });

        userToSave.email = userToSave.email?.toLowerCase();

        if (userType === 'doctor' && category == null) return res.status(400).send('No puedes agregar un doctor sin especialidad');
        if (userType === 'lab' && lab_category == null) return res.status(400).send('No puedes agregar un laboratorio sin especialidad');

        const checkEmail = await User.findOne({ where: { email: userToSave.email } });
        if (checkEmail) return res.status(401).send("Email o usuario en uso");

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
        console.log(error, 'error');
        res.status(400).send({
            msg: 'No se pudo guardar el usuario',
            ok: false
        });
    }
}



async function updateUser(req, res) {
    try {
        const id = req.params.id;

        if (!id) return res.status(400).send('Debes enviar un id')

        const update = req.body;

        const user = await User.findByPk(id);

        if (!user) {
            return res.status(404).send({
                msg: `No se encontro el usuario`,
                ok: false,
            });
        }

        await user.update(update);

        const updatedUser = await User.findOne({
            where: { id },
            attributes: { exclude: ['password'] }
        });

        return res.status(200).send({
            msg: `Actualizar usuario ${id}`,
            newUser: updatedUser,
            ok: true,
        });

    } catch (error) {
        console.log(error)
        res.status(400).send({
            msg: `Error al actualizar el usuario`,
            ok: false,
        });
    }
}

const banUser = async (req, res) => {
    try {
        const id = req.params.id;
        const user = await User.findByPk(id);
        if (!user) {
            return res.status(404).send(`El usuario con id ${id} no se ha encontrado`);
        }
        if (user.banned == false) {
            user.banned = true;
        } else {
            user.banned = false
        }
        await user.save();
        return res.status(200).send(user);
    } catch (error) {
        console.log(error);
        res.status(400).send('Error al actualizar estado de usuario');
    }
};


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

        const token = jwt.sign(user.toJSON(), secret);

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

async function forgotPassword(req, res) {
    try {
        const { email } = req.body;

        // Check if the email exists in the database
        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        // Generate a unique resetTokenId (UUID)
        const resetTokenId = uuidv4();

        // Generate a password reset JWT token with a 1-hour expiration
        const jwtPayload = { userId: user.id };
        const jwtToken = jwt.sign(jwtPayload, 'your-secret-key', { expiresIn: '1h' });

        // Save the resetTokenId and JWT token data in the user model
        user.resetTokenId = resetTokenId;
        user.resetTokenData = jwtToken;
        user.passwordResetExpires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

        await user.save();

        // Send the password reset email to the user's email
        const mailOptions = {
            from: process.env.MAILER_MAIL,
            to: email,
            subject: 'Password Reset Request',
            text: `Click the following link to reset your password: ${process.env.CORS_DOMAIN}/reset-password/${resetTokenId}`,
            // You can also use HTML content for the email body if you prefer
            // html: `<p>Click the following link to reset your password: <a href="http://your-frontend-url/reset-password/${resetTokenId}">Reset Password</a></p>`
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error(error);
                return res.status(500).json({ message: 'Failed to send reset password email.' });
            } else {
                console.log('Reset password email sent:', info.response);
                return res.json({ message: 'Password reset email sent.' });
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error.' });
    }
}

async function resetPassword(req, res) {
    try {
        const { newPassword } = req.body;
        const { token: resetTokenId } = req.params

        // Find the user based on the resetTokenId
        const user = await User.findOne({ where: { resetTokenId } });

        // Verify the user and the JWT token data
        if (!user || user.passwordResetExpires < new Date()) {
            return res.status(400).json({ message: 'Invalid or expired password reset token.' });
        }

        const decodedToken = jwt.verify(user.resetTokenData, 'your-secret-key');
        if (!decodedToken || decodedToken.userId !== user.id) {
            return res.status(400).json({ message: 'Invalid or expired password reset token.' });
        }

        // Update the user's password
        const hash = await bcrypt.hash(newPassword, saltRounds);
        user.password = hash;
        user.resetTokenId = null;
        user.resetTokenData = null;
        user.passwordResetExpires = null;

        await user.save();

        return res.json({ message: 'Password reset successful.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error.' });
    }
}

async function uploadImage(req, res) {
    try {
        const userId = req.body.id; // Assuming you have set up authentication and have access to the user object through req.user
        const imageUrl = await upload(req.body.image);

        // Update the profile_picture_url field in the user model
        await User.update(
            { profile_picture_url: imageUrl },
            { where: { id: userId } }
        );

        res.send(imageUrl);
    } catch (error) {
        console.error('Error uploading image:', error);
        res.status(500).send(error);
    }
}

module.exports = {
    getUsers,
    getUser,
    getDoctors,
    getLabs,
    addUser,
    banUser,
    updateUser,
    getUsersByCategory,
    login,
    forgotPassword,
    resetPassword,
    uploadImage,
}
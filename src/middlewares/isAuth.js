require ('dotenv').config({path:'./.env'});
const jwt = require('jsonwebtoken');
const secret = process.env.SECRET_KEY


function jwtVerify(req, res, next) {
    try {
        const token = req.headers.authorization;
        if(!token) {
            return res.status(400).send({
                msg: 'Token inexistente',
                ok: false
            })
        }
    
        jwt.verify(token, secret, (error, payload) => {
            if(error) {
                console.log(error);
                return res.status(401).send({            
                    msg: 'Invalid Token',
                    ok: false
                })
            } 
            req.user = payload;
            next();            
        });
    
    } catch (error) {
        return res.status(400).send({
            msg: 'Token inexistente',
            ok: false
        })
    }
}

module.exports = jwtVerify
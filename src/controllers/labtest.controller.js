require("dotenv").config({ path: "./.env" });
const { Turno, User, Labtest } = require("../db");

async function getLabtest(req, res) {
    try {
        const { userId, doctorId, labId } = req.body;
        let test;
        if(userId){
            test = Labtest.findOne({
                where: {
                    userId: userId      
                }
            })
        } else if(doctorId){
            test = Labtest.findOne({
                where: {
                    doctorId: doctorId      
                }
            })
        } else {
            test = Labtest.findOne({
                where: {
                    labId: labId      
                }
            })
        }
        return res.status(200).send(test)
    } catch (error) {
        console.log(error)
        return res.status(400).send('Ha habido un error')
    }
}

async function uploadLabtest(req, res) {
    
}

module.exports = {
    getLabtest,
    uploadLabtest,
}

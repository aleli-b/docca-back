require("dotenv").config({ path: "./.env" });
const { Turno, User, Labtest } = require("../db");
const { aws_upload_pdf } = require("../utils/S3")

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
    try {
        const { labId, userId, doctorId, } = req.body;
        const url = await aws_upload_pdf(req.body);
        const labtest = new Labtest({
            lab_test_url: url.url,
            labId: labId,
            userId: userId,
            doctorId: doctorId,
        })
        await labtest.save();
        return res.status(200).send('SUBIDO PDF');
    } catch (error) {
        console.log(error);
        return res.status(400).send('Ha habido un error');
    }
}

module.exports = {
    getLabtest,
    uploadLabtest,
}
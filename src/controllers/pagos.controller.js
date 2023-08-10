require("dotenv").config({ path: "./.env" });
const bodyParser = require("body-parser");
const { Pago, User, Turno } = require("../db");
const axios = require("axios");

async function setPago(userData, turnoId) {
  const { paymentId } = userData;
  try {
    const pago = await Pago.create({ paymentId, turnoId: turnoId });
    return;
  } catch (error) {
    console.error(error);
  }
}

async function getPago(req, res) {
  const pagoId = req.params.pagoId;
  console.log("este es ura" + " "+ pagoId)
  try {
    const pago = await Pago.findAll({ 
      where: { 
        id: pagoId } ,
        include: [{
          model: Turno,
          as: "turnoPay",
            include: [
              {
                model: User,
                as: "paciente"
              }
            ]
          }
        ]
      });
    return res.status(200).send(pago);
  } catch (error) {
    console.error(error);
  }
}

module.exports = {
  setPago,
  getPago,
};

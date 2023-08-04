require("dotenv").config({ path: "./.env" });
const bodyParser = require("body-parser");
const { Pago } = require("../db");
const axios = require("axios");


async function setPago(userData, idPagoMP) {
    const { date, userId, doctorId} = userData;
    const {idPago} = idPagoMP;
    try {
      const pago = await Pago.create({ idPago, userId, doctorId });
      return(pago);
    } catch (error) {
      // console.error(error);
      return("Error al registrar el pago en la Base de Datos");
    }
  }

  module.exports = {
    setPago,
  };
  
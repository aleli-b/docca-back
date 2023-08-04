require("dotenv").config({ path: "./.env" });
const bodyParser = require("body-parser");
const { Pago } = require("../db");
const axios = require("axios");

async function setPago(userData) {
  const { date, userId, doctorId, paymentId } = userData;
  try {
    const pago = await Pago.create({ paymentId, userId, doctorId });
    return ;
  } catch (error) {
    console.error(error);
  }
}

module.exports = {
  setPago,
};

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
  try {
    const pago = await Pago.findAll({
      where: {
        id: pagoId,
      },
      include: [
        {
          model: Turno,
          as: "turnoPay",
          include: [
            {
              model: User,
              as: "paciente",
            },
          ],
        },
      ],
    });
    return res.status(200).send(pago);
  } catch (error) {
    console.error(error);
  }
}

async function getConsultas(req, res) {
  const userId = req.params.userId;
  try {
    const pagos = await Pago.findAll({
      include: [
        {
          model: Turno,
          as: "turnoPay",
          where: { userId },
          include: [
            {
              model: User,
              as: "doctor",
              attributes: ["name", "lastName", "userType", "category","lab_category"],
            },
          ],
        },
      ],
    });
    return res.status(200).send(pagos);
  } catch (error) {
    console.error("Error al obtener los pagos:", error);
    throw error;
  }
}

module.exports = {
  setPago,
  getPago,
  getConsultas,
};

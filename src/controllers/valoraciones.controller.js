require("dotenv").config({ path: "./.env" });
const bodyParser = require("body-parser");
const mercadopago = require("mercadopago");
const { Valoraciones } = require("../db");
const axios = require("axios");

async function setValoration(userData) {
  const { date, userId, doctorId } = userData;
  console.log("primera", date);
  console.log(userId, doctorId);
  try {
    const pacienteHasTurno = await Turno.findOne({
      where: { userId },
      include: "paciente",
    });
    const doctorCheck = await Turno.findOne({
      where: { doctorId },
      include: "doctor",
    });

    if (doctorCheck && date === doctorCheck.date) {
      console.log("The Doctor already has a turno");
      return "The Doctor already has a turno";
    }

    if (pacienteHasTurno) {
      console.log("The User already has a turno");
      return "The User already has a turno";
    }

    const turno = await Turno.create({ date, userId, doctorId });
    return turno;
  } catch (error) {
    // console.error(error);
    return "Error creating turno";
  }
}



async function getValoration(req, res) {
  console.log(req.body.doctorId)
  try {
    const valoraciones = await Valoraciones.findAll({
      where: {
        doctorId: req.body.doctorId
      },
    });

    let sumaValoracion = 0;
    for (const valoracion of valoraciones) {
      sumaValoracion += valoracion.valoracion;
    }

    const cantidadRegistros = valoraciones.length;
    const promedioValoracion =
      cantidadRegistros > 0 ? sumaValoracion / cantidadRegistros : 0;
    res.json({ promedioValoracion });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
}

module.exports = {
  setValoration,
  getValoration,
};

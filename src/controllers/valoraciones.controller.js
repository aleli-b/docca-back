require("dotenv").config({ path: "./.env" });
const bodyParser = require("body-parser");
const mercadopago = require("mercadopago");
const { User } = require("../db");
const axios = require("axios");


async function setValoracion(userData) {
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
        return("The Doctor already has a turno");
      }
  
      if (pacienteHasTurno) {
        console.log("The User already has a turno");
        return("The User already has a turno");
      }
  
      const turno = await Turno.create({ date, userId, doctorId });
      return(turno);
    } catch (error) {
      // console.error(error);
      return("Error creating turno");
    }
  }


  async function getValoracion(userData) {
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
        return("The Doctor already has a turno");
      }
  
      if (pacienteHasTurno) {
        console.log("The User already has a turno");
        return("The User already has a turno");
      }
  
      const turno = await Turno.create({ date, userId, doctorId });
      return(turno);
    } catch (error) {
      // console.error(error);
      return("Error creating turno");
    }
  }



  module.exports = {
    setValoracion,
    getValoracion
  };
  
require("dotenv").config({ path: "./.env" });
const bodyParser = require("body-parser");
const mercadopago = require("mercadopago");
const { Valoraciones, Turno } = require("../db");
const axios = require("axios");

const setValoration = async (req, res) => {
  try {
    const turno = await Turno.findOne({
      where: {
        id: req.body.turnoId,
      },
    });

    if (!turno) {
      return res
        .status(404)
        .json(`El turno con el ID ${req.body.turnoId} no existe`);
    } else {
      const getValoration = await Valoraciones.findOne({
        where: {
          turnoId: req.body.turnoId,
        },
      });
      if (!getValoration) {
        const valoration = await Valoraciones.create({
          turnoId: req.body.turnoId,
          userId: req.body.userId,
          doctorId: req.body.doctorId,
          valoracion: req.body.valoracion,
          reseña: req.body.reseña,
        });
        res.status(200).json("Valoración guardada correctamente");
        return valoration;
      } else {
        const valoration = await Valoraciones.update(
          {
            userId: req.body.userId,
            doctorId: req.body.doctorId,
            valoracion: req.body.valoracion,
            reseña: req.body.reseña,
          },
          {
            where: {
              turnoId: req.body.turnoId,
            },
          }
        );
        res.status(200).json("Valoración actualizada correctamente");
        return valoration;
      }
    }
  } catch (error) {
    console.log(error);
    res.status(400).send("Error al actualizar estado de usuario");
  }
};

async function getValoration(req, res) {
  console.log(req.body.doctorId);
  try {
    const valoraciones = await Valoraciones.findAll({
      where: {
        doctorId: req.body.doctorId,
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

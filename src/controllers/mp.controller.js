const { addTurno } = require("../controllers/turno.controller");
require("dotenv").config({ path: "./.env" });
const bodyParser = require("body-parser");
const mercadopago = require("mercadopago");
const { User } = require("../db");
const axios = require("axios");
const MpAccessToken = process.env.MpAccessToken;
const CORS_DOMAIN = process.env.CORS_DOMAIN;
mercadopago.configure({
  access_token: MpAccessToken,
});
const svHost = process.env.VITE_HOST;

async function setPreferences(req, res) {
  const { doctor, user, turno } = req.body;
  let data = {
    date: turno,
    userId: user.id,
    doctorId: doctor.id,
    price: Number(doctor.price),
  };
  const queryString = new URLSearchParams(data).toString();
  const url = () => {
    axios.post(`${svHost}/turnos`, queryString);
  };

  let preference = {
    items: [
      {
        title: "Consulta medica",
        unit_price: Number(doctor.price),
        quantity: 1,
        currency_id: "ARS",
      },
    ],
    back_urls: {
      success: "http://localhost:4000/feedback",
      failure: "http://localhost:4000/feedback",
      pending: "http://localhost:5173/",
    },
    binary_mode: true,
  };

  mercadopago.preferences
    .create(preference)
    .then((response) => res.status(200).send({ response }))
    .catch((error) => res.status(400).send({ error: error.message }));
}

//Esta función se encarga de crear el id de Referencia para que se genere el checkout de MP
async function setPreferencesSubscription(req, res) {
  const { user, price } = req.body;

  let preference = {
    items: [
      {
        title: "Subscripción",
        unit_price: Number(price),
        quantity: 1,
        currency_id: "ARS",
      },
    ],
    external_reference: user.id,
    back_urls: {
      success: `${svHost}/feedbackSubscription`,
      failure: `${svHost}/feedbackSubscription`,
      pending: "",
    },
    binary_mode: true,
    auto_return: "approved",
  };

  mercadopago.preferences
    .create(preference)
    .then((response) => res.status(200).send({ response }))
    .catch((error) => res.status(400).send({ error: error.message }));
}

async function feedback(req, res) {
  let dataPay = {
    Payment: req.query.payment_id,
    Status: req.query.status,
    MerchantOrder: req.query.merchant_order_id,
    ExternalReference: req.query.external_reference,
  };
  res.json(dataPay);
}
async function feedbackSubscription(req, res) {
  try {
    let dataPay = {
      Payment: req.query.payment_id,
      Status: req.query.status,
      MerchantOrder: req.query.merchant_order_id,
      ExternalReference: req.query.external_reference,
    };
    const user = await User.findByPk(dataPay.ExternalReference);
    if (dataPay.Status === "approved") {
      await user.update({ subscription: true });
      res.redirect(CORS_DOMAIN);
    } else {
      res.redirect(CORS_DOMAIN);
    }
  } catch (error) {
    console.error(error);
    return res.send("El ID no existe");
  }
}

module.exports = {
  setPreferences,
  feedback,
  setPreferencesSubscription,
  feedbackSubscription,
};

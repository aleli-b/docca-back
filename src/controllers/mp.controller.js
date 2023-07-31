require("dotenv").config({ path: "./.env" });
const bodyParser = require("body-parser");
const mercadopago = require("mercadopago");
const axios = require("axios");
const MpAccessToken = process.env.MpAccessToken;
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
      success: "http://localhost:5173/",
      failure: "http://localhost:5173/",
      pending: "http://localhost:5173/",
    },
    binary_mode: true,
  };

  mercadopago.preferences
    .create(preference)
    .then((response) => res.status(200).send({ response }))
    .catch((error) => res.status(400).send({ error: error.message }));
}

async function feedback(req, res) {
  res.json({
    Payment: req.query.payment_id,
    Status: req.query.status,
    MerchantOrder: req.query.merchant_order_id,
  });
}

module.exports = {
  setPreferences,
  feedback,
};

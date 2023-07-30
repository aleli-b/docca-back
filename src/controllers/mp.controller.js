require("dotenv").config({ path: "./.env" });
const mercadopago = require("mercadopago");

mercadopago.configure({
  access_token:
    "TEST-5791839937579163-061313-2326fdc8dd07fa72de29291209ea889d-41786301",
});

async function setPreferences(req, res) {
  let preference = {
    items: [
      {
        title: "Consulta medica",
        unit_price: Number(req.body.price),
        quantity: 1,
      },
    ],
    back_urls: {
        "success": "http://localhost:4000/feedback",
        "failure": "http://localhost:4000/feedback",
        "pending": "http://localhost:4000/feedback"
    },
  };

  mercadopago.preferences
    .create(preference)
    .then(function (response) {
      res.json({
        id: response.body.id,
      });
    })
    .catch(function (error) {
      console.log(error);
    });
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
  feedback
};

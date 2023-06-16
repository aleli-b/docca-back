const server = require('./src/app.js');
require('dotenv').config();

const port = process.env.PORT;
const { db } = require('./src/db.js');

db.sync({ alter: true }).then(() => {
 console.log(port);
 server.listen(port, () => {
  console.log(`%s listening at ${port}`);
 });
});

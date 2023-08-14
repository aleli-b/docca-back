const http = require('http');
const socketIO = require('socket.io');
const { db } = require('./src/db.js');
const handleSocketConnection = require('./src/sockets/socketHandlers');
const app = require('./src/app.js');
const { CORS_DOMAIN } = process.env;

require('dotenv').config();

const port = process.env.PORT || 4000;

const httpServer = http.createServer(app);
const io = socketIO(httpServer, {
  cors: {
    origin: [CORS_DOMAIN, `www.${CORS_DOMAIN}`],
    methods: ["GET", "POST"]
  }
});

handleSocketConnection(io);

db.sync({ alter: true })
  .then(() => {
    console.log('Database synced successfully');
    httpServer.listen(port, () => {
      console.log(`Server listening at ${port}`);
    });
  })
  .catch((error) => {
    console.error('Error syncing database:', error);
  });
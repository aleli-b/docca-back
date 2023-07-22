const http = require('http');
const socketIO = require('socket.io');
const { db } = require('./src/db.js');
const handleSocketConnection = require('./src/sockets/socketHandlers');
const app = require('./src/app.js');
const { CORS_DOMAIN } = process.env;

require('dotenv').config();

const port = process.env.PORT || 4000; // Use a default port (e.g., 3000) if PORT is not specified in the environment

const httpServer = http.createServer(app);
const io = socketIO(httpServer, {
  cors: {
    origin: CORS_DOMAIN,
    methods: ["GET", "POST"]
  }
});

// Initialize the socket connection handling
handleSocketConnection(io);

// Sync the database and start the server
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

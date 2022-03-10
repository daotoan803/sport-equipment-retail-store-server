require('dotenv').config();
const express = require('express');
const path = require('path');
const logger = require('morgan');
const http = require('http');
const { Server } = require('socket.io');
const swaggerUI = require('swagger-ui-express');
const swaggerSpec = require('./src/docs/swaggerOption');

const routes = require('./src/routes');
const database = require('./src/models');
const chatSocket = require('./src/socket/chat.socket');

const app = express();
const server = http.createServer(app);

// SWAGGER
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerSpec));

// LOGGER
app.use(
  logger('dev', {
    skip(req) {
      return req.url.includes('/images/');
    },
  })
);

//MIDDLEWARES
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'upload')));

//ROUTES
app.use('/api', routes);

//SOCKET.IO
const io = new Server(server);
chatSocket.init(io);

//START SERVER
if (require.main === module) {
  database.initialize().then(() => {
    const PORT = process.env.PORT || 4000;
    server.listen(PORT, () => {
      console.log(`\n\n\nport : http://localhost:${PORT}\n\n\n`);
    });
  });
}

module.exports = app;

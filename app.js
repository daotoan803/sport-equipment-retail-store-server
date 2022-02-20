require('dotenv').config();
const express = require('express');
const path = require('path');
const morgan = require('morgan');
const http = require('http');
const { Server } = require('socket.io');

const routes = require('./src/routes/index.js');
const database = require('./src/models/index.js');
const registerChatHandler = require('./src/realtime_handler/chat.handler');

const app = express();

app.use(
  morgan('dev', {
    skip: (req) => {
      return req.url.includes('/images/');
    },
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'client')));
app.use(express.static(path.join(__dirname, 'upload')));
app.use('/api', routes);

const server = http.createServer(app);
const io = new Server(server);
registerChatHandler(io);

if (require.main === module) {
  database.initialize().then(() => {
    const PORT = process.env.PORT || 4000;
    server.listen(PORT, () => {
      console.log(`\n\n\nport : http://localhost:${PORT}\n\n\n`);
    });
  });
}

module.exports = app;

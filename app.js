require('dotenv').config();
const express = require('express');
const path = require('path');

const routes = require('./src/routes/index.js');
const database = require('./src/models/index.js');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/api', routes);

database().then(() => {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log('port : http://localhost:' + PORT);
  });
});

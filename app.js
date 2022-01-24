require('dotenv').config();
const express = require('express');
const path = require('path');
const morgan = require('morgan');

const routes = require('./src/routes/index.js');
const database = require('./src/models/index.js');

const app = express();

app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'client')));
app.use(express.static(path.join(__dirname, 'upload')));
app.use('/api', routes);

if (require.main === module) {
  database.initialize().then(() => {
    const PORT = process.env.PORT || 4000;
    app.listen(PORT, () => {
      console.log(`\n\n\nport : http://localhost:${PORT}\n\n\n`);
    });
  });
}

module.exports = app;

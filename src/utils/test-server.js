const findPort = require('find-free-port');
const app = require('../../app');

const getFreePort = () => {
  return new Promise((resolve, reject) => {
    findPort(4000, (err, port) => {
      if (err) reject(err);
      resolve(port);
    });
  });
};

module.exports = class TestServer {
  constructor() {
    this.port = 0;
    this.proxy = '';
    this.server = null;
  }

  async startServer() {
    this.port = await getFreePort();
    this.server = app.listen(this.port);
    this.proxy = `http://localhost:${this.port}`;
    return this.proxy;
  }

  async shutDownServer() {
    this.server.close();
  }
};

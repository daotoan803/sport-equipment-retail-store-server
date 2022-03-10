const swaggerJsDoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Online shop api',
      version: '1.0.0',
      description: 'Online shop build with nodejs',
    },
    servers: [{ url: 'http://localhost:4000' }],
    
  },
  apis: ['src/docs/*.yml', 'src/routes/admin/*.js', 'src/routes/common/*.js', 'src/routes/common/user/*.js'],
};

module.exports = swaggerJsDoc(options);

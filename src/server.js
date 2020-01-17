require("dotenv").config();
const server_port = process.env.PORT || process.env.MY_PORT || 5000;
const server_host = process.env.MY_HOST || '0.0.0.0';
//requires
const DatabaseController = require('./Controllers/DatabaseController')
const express = require("express");
const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
//const swaggerDocument = require('./swagger.json');
// Initialization variables
const url = '/api';
const app = express();
const dbclient = new DatabaseController(process.env.DBPATH);
const options = {
  definition: {
    openapi: '3.0.0', // Specification (optional, defaults to swagger: '2.0')
    info: {
      title: 'Documentation API', // Title (required)
      version: '1.0.0', // Version (required)
    },
  },
  // Path to the API docs
  apis: [__dirname + '/server.js'],
  basePath: 'api/'
};

const swaggerSpec = swaggerJSDoc(options);
module.exports = swaggerSpec;

// Initialize swagger-jsdoc -> returns validated swagger spec in json format
app.use('/api-doc', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

/**
 * @swagger
 * 
 * tags:
 * - name: API Code Promotionnel
 *   description: Regroupe les requêtes d'accès à la base de données stockant les codes promotionnels 
 * 
 *paths:
 *  /api/coupon/{qrcodeID}:
 *    get:
 *      description: Permet de récupérer le code promotionnel lié à un QrCode
 *      tags: 
 *      - API Code Promotionnel
 *      produces:
 *        - application/json
 *      parameters:
 *        - in: path
 *          name: qrcodeID
 *          description: ID du qrcode scanné
 *          required: true
 *          type: int
 *      responses:
 *        200:
 *          description: Récupération OK
 */
app.get(url + "/coupon/:id", async (req, res) => {
  res.append("Content-Type", "application/json");
  dbclient.getCodePromoByQrCodeId(req.params.id)
    .then((result) => {
      res.send({ codepromo: result.code });
    }).catch((erreur) => {
      res.status(500).send({ erreur: "Not Found" });
    });
});


app.listen(server_port);
const express = require('express');
const DevController = require('./controllers/DevController');
const DeslikesController = require('./controllers/DeslikesController');
const LikeController = require('./controllers/LikeController');

// Cria a rota (URL)
const routes = express.Router();

routes.get('/devs', DevController.index);
routes.post('/devs', DevController.store);
routes.post('/devs/:devId/likes', LikeController.store);
routes.post('/devs/:devId/deslikes', DeslikesController.store);

// exporta para o uso externo (como o server.js)
module.exports = routes;

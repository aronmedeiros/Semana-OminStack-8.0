// chama o express (pacote)
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const routes = require('./routes');

// cria o server
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server, {
    cors: {
      origin: "http://localhost:3000",
      methods: ["GET", "POST"],
      credentials: true
    },
});

const connectedUsers = {};

io.on('connection', socket => {
    const { user } = socket.handshake.query;
    connectedUsers[user] = socket.id;
});

// conecta ao mongoDB
mongoose.connect('', { useNewUrlParser: true, useUnifiedTopology: true });

// passa a informação para os controllers
app.use((req, res, next) => {
    req.io = io;
    req.connectedUsers = connectedUsers;

    return next();
});

// diz ao express que usaremos json
app.use(cors());

// diz ao express que usaremos json
app.use(express.json());

// diz que usaremos as rotas do arquivo routes.js
app.use(routes);

// adicoonar a porta
server.listen(3333);
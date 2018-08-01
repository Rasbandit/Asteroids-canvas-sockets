const express = require('express');
const path = require('path');
const Game = require('./classes/main');

const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);

app.use(express.static(path.join(__dirname, './../public')));

const mainCtrl = require('./controllers/mainCtrl');

const chat = io.on('connection', socket => {
  mainCtrl.respond(chat, socket);
});

http.listen(3000, () => {
  console.log('listening on port 3000');
});

module.exports = app;

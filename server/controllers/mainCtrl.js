const state = require('../state');
const Game = require('./../classes/main');

const game = new Game();
game.run();

module.exports.respond = function name(io, socket) {
  setInterval(() => {
    const converted = JSON.stringify(game.state);
    socket.emit('newState', converted);
  }, 16);

  function explosion(number) {
    socket.emit('explosion', number);
  }

  game.state.currentState.explosion = explosion;

  socket.on('keyDown', key => {
    game.state.input.keyDown(key);
  });

  socket.on('keyUp', key => {
    game.state.input.keyUp(key);
  });

  socket.on('fire', position => {
    if (game.state.currentState.ship.visible) {
      game.state.currentState.bullets.push(game.state.currentState.ship.shoot(position));
      socket.emit('fireSound');
    }
  });

  socket.on('disconnect', () => {});
};

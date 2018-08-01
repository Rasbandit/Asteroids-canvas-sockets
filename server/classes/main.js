const GameState = require('./GameState');
const STATES = require('./../references/gameStates');
const MenuState = require('./MenuState');
const InputHandeler = require('./InputHandeler');

module.exports = class Game {
  constructor() {
    this.state = {
      currentState: null,
      nextState: STATES.GAME,
      input: new InputHandeler({
        left: 37,
        up: 38,
        right: 39,
        down: 40,
        spacebar: 32,
      }),
    };
  }

  run() {
    setInterval(() => {
      if (this.state.nextState !== STATES.NO_CHANGE) {
        switch (this.state.nextState) {
          case STATES.MENU:
            console.log('hi?');
            this.currentState = new MenuState(this);
            break;
          case STATES.GAME:
            this.state.currentState = new GameState(this);
            break;
          default:
            break;
        }
        this.state.nextState = STATES.NO_CHANGE;
      }
      this.state.currentState.handleInputs(this.state.input);
      this.state.currentState.update();
    }, 1000 / 35);
  }
};

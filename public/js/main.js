import GameState from './GameState';
import Canvas from './canvas';
import STATES from './../references/gameStates';
import Asteroid from './Asteroid';
import Ship from './Ship';
import Bullet from './Bullet';
import InputHandeler from './InputHandeler';

const FIRE_SOUND = new Audio('./../sounds/fire.wav');
const THRUST_SOUND = new Audio('./../sounds/thrust.wav');
const BIG_EXPLOSION_SOUND = new Audio('./../sounds/bangLarge.wav');
const MEDIUM_EXPLOSION_SOUND = new Audio('./../sounds/bangMedium.wav');
const SMALL_EXPLOSION_SOUND = new Audio('./../sounds/bangSmall.wav');

export default class Game {
  constructor() {
    this.canvas = new Canvas(640, 480);

    this.input = new InputHandeler({
      left: 37,
      up: 38,
      right: 39,
      down: 40,
      spacebar: 32,
    });

    this.canvas.ctx.strokeStyle = '#fff';

    this.canvas.canvas.addEventListener('click', event => {
      const mousePosition = { x: event.offsetX, y: event.offsetY };
      socket.emit('fire', mousePosition);
    });

    this.state = {
      currentState: null,
      nextState: STATES.GAME,
    };

    socket.on('fireSound', () => {
      FIRE_SOUND.cloneNode(true).play();
    });

    socket.on('explosion', num => {
      switch (num) {
        case 8:
          BIG_EXPLOSION_SOUND.cloneNode(true).play();
          break;
        case 4:
          MEDIUM_EXPLOSION_SOUND.cloneNode(true).play();
          break;
        case 2:
          SMALL_EXPLOSION_SOUND.cloneNode(true).play();
          break;
        default:
          break;
      }
    });

    socket.on('newState', state => {
      this.state = JSON.parse(state);
      if (this.state.currentState.bullets) {
        this.state.currentState = Object.setPrototypeOf(this.state.currentState, GameState.prototype);
        this.state.currentState.asteroids.map(asteroid => Object.setPrototypeOf(asteroid, Asteroid.prototype));
        this.state.currentState.ship = Object.setPrototypeOf(this.state.currentState.ship, Ship.prototype);
        this.state.currentState.bullets.map(bullet => Object.setPrototypeOf(bullet, Bullet.prototype));
      }
    });
  }

  run() {
    this.canvas.animate(() => {
      if (this.state.currentState !== null) {
        this.state.currentState.handleInputs(this.input);
        // this.state.currentState.update();
        this.state.currentState.render(this.canvas.ctx);
      }
    });
  }
}

import Polygon from './Polygon';

export default class Asteroid extends Polygon {
  constructor(points, size, x, y) {
    super(points);

    this.maxX = 640;
    this.maxY = 480;

    this.x = x;
    this.y = y;

    this.scale(size);

    this.rotationSpeed = 0.02 * ((Math.random()) + 1);

    const direction = 2 * Math.PI * Math.random();
    const speed = Math.random() + 1;
    this.velocity = {
      x: speed * Math.cos(direction),
      y: speed * Math.sin(direction)
    };
  }

  update() {
    this.x += this.velocity.x;
    this.y += this.velocity.y;

    if (this.x > this.maxX + (this.size * 6)) {
      this.x = -(this.size * 6);
    } else if (this.x < -(this.size * 6)) {
      this.x = this.maxX + (this.size * 6);
    }

    if (this.y > this.maxY + (this.size * 6)) {
      this.y = -(this.size * 6);
    } else if (this.y < -(this.size * 6)) {
      this.y = this.maxY + (this.size * 6);
    }

    this.rotate(this.rotationSpeed);
  }

  draw(ctx) {
    ctx.drawPolygon(this, this.x, this.y);
  }
}

import Polygon from './Polygon';

export default class Bullet extends Polygon {
  draw(ctx) {
    ctx.beginPath();
    ctx.moveTo(this.prevx, this.prevy);
    ctx.lineTo(this.x, this.y);
    ctx.stroke();
  }
}

import POINTS from './../references/Points';

export default class Canvas {
  constructor(width, height) {
    this.canvas = document.createElement('canvas');
    this.canvas.width = width;
    this.canvas.height = height;

    this.ctx = (function(ctx) {
      ctx.width = ctx.canvas.width;
      ctx.height = ctx.canvas.height;

      ctx.drawPolygon = function(polygon, x, y) {
        const { points } = polygon;
        this.beginPath();
        this.moveTo(points[0] + x, points[1] + y);
        for (let i = 2; i < points.length; i += 2) {
          this.lineTo(points[i] + x, points[i + 1] + y);
        }
        this.stroke();
      };

      ctx.clearAll = function() {
        this.clearRect(0, 0, this.width, this.height);
      };

      ctx.ACODE = 'A'.charCodeAt(0);
      ctx.ZCODE = '0'.charCodeAt(0);
      ctx.SCODE = ' '.charCodeAt(0);

      ctx.vectorText = function(text, s, xCoordinate, yCoordinate) {
        text = text
          .toString()
          .toUpperCase()
          .split('');
        const step = s * 6;

        if (typeof xCoordinate !== 'number') {
          xCoordinate = Math.round((this.width - text.length * step) / 2);
        }

        xCoordinate += 0.5;
        yCoordinate += 0.5;

        text.forEach(character => {
          const charCode = character.charCodeAt(0);
          if (charCode === this.SCODE) {
            xCoordinate += step;
            return;
          }
          let p = null;
          if (charCode - this.ACODE >= 0) {
            p = POINTS.LETTERS[charCode - this.ACODE];
          } else {
            p = POINTS.NUMBERS[charCode - this.ZCODE];
          }
          this.beginPath();
          this.moveTo(p[0] * s + xCoordinate, p[1] * s + yCoordinate);
          for (let i = 2; i < p.length; i += 2) {
            this.lineTo(p[i] * s + xCoordinate, p[i + 1] * s + yCoordinate);
          }
          this.stroke();
          xCoordinate += step;
        });
      };

      return ctx;
    })(this.canvas.getContext('2d'));

    document.body.appendChild(this.canvas);
  }

  animate(loop) {
    const rf = (() =>
      window.requestAnimationFrame ||
      window.webkitRequestAnimationFrame ||
      window.mozRequestAnimationFrame ||
      window.oRequestAnimationFrame ||
      window.msRequestAnimationFrame)();

    const looper = () => {
      loop();
      rf(looper);
    };
    rf(looper);
  }
}

import State from './State';
import Ship from './Ship';

export default class GameState extends State {
  render(ctx) {
    ctx.clearAll();
    ctx.vectorText(this.score, 3, 20, 10);
    for (let i = 0; i < this.lives; i += 1) {
      const xPosistion = 30 + 15 * i;
      ctx.drawPolygon(this.lifePolygon, xPosistion, 45);
    }

    this.bullets.forEach(bullet => bullet.draw(ctx));
    this.asteroids.forEach(asteroid => {
      asteroid.draw(ctx);
    });
    this.ship.draw(ctx);
  }
}

import Game from './main';

const game = new Game();
game.run();


export default class InputHandeler {
  constructor(keys) {
    this.keys = {};
    this.down = {};
    this.pressed = {};

    for (const key in keys) {
      const code = keys[key];

      this.keys[code] = key;
      this.down[key] = false;
      this.pressed[key] = false;
    }

    document.addEventListener('keydown', event => {
      if (this.keys[event.keyCode] && this.down[this.keys[event.keyCode]] === false) {
        socket.emit('keyDown', event.keyCode);
      }
    });

    document.addEventListener('keyup', event => {
      if (this.keys[event.keyCode]) {
        socket.emit('keyUp', event.keyCode);
      }
    });
  }

  isDown(key) {
    return this.down[key];
  }

  isPressed(key) {
    if (this.pressed[key]) {
      return false;
    } else if (this.down[key]) {
      this.pressed[key] = true;
      return this.pressed[key];
    }
    return false;
  }
}

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


export default class Polygon {
  constructor(points) {
    this.points = points.slice(0);
  }

  rotate(theta) {
    const cosine = Math.cos(theta);
    const sine = Math.sin(theta);

    for (let i = 0; i < this.points.length; i += 2) {
      const x = this.points[i];
      const y = this.points[i + 1];

      this.points[i] = (cosine * x) - (sine * y);
      this.points[i + 1] = (sine * x) + (cosine * y);
    }
  }
  scale(size) {
    for (let i = 0; i < this.points.length; i++) {
      this.points[i] *= size;
    }
  }
  hasPoints(offsetX, offsetY, x, y) {
    let collision = false;
    const p = this.points;
    const length = p.length;
    for (let i = 0, j = length - 2; i < length; i += 2) {
      const px1 = p[i] + offsetX;
      const px2 = p[j] + offsetX;
      const py1 = p[i + 1] + offsetY;
      const py2 = p[j + 1] + offsetY;

      if ((py1 > y != py2 > y) &&
        (x < (px2 - px1) * (y - py1) / (py2 - py1) + px1)
      ) {
        collision = !collision;
      }
      j = i;
    }
    return collision;
  }
}

import Polygon from './Polygon';

export default class Asteroid extends Polygon {
  draw(ctx) {
    if (!this.visible) {
      return;
    }
    ctx.drawPolygon(this, this.x, this.y);
    if (this.drawFlames) ctx.drawPolygon(this.flames, this.x, this.y);
    // this.drawFlames = false;
  }
}

export default class State {
  constructor(game) {
    this.game = game;
  }

  handleInputs() {

  }

  render(ctx) {

  }
}

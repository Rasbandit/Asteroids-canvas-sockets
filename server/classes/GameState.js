const State = require('./State');
const Ship = require('./Ship');
const Asteroid = require('./Asteroid');
const POINTS = require('./../references/points');
const STATES = require('./../references/gameStates');
const Polygon = require('./Polygon');

const SIZE = 8;

module.exports = class GameState extends State {
  constructor(game) {
    super(game);

    this.asteroids = [];
    this.bullets = [];

    this.ship = new Ship(POINTS.SHIP, POINTS.FLAMES, 2, 320, 240);

    this.lvl = 0;
    this.lives = 3;
    this.gameOver = false;

    this.score = 0;

    this.lifePolygon = new Polygon(POINTS.SHIP);
    this.lifePolygon.scale(1.5);
    this.lifePolygon.rotate(-Math.PI / 2);

    this.generateLvl(this.lvl);
  }

  handleInputs(input) {
    if (!this.ship.visible) {
      if (input.isPressed('spacebar')) {
        if (this.gameOver) {
          this.lvl = 0;
          this.lives = 3;
          this.score = 0;
          this.gameOver = false;
          this.asteroids = [];
          this.bullets = [];
          this.ship.visible = true;
          this.generateLvl();
          return;
        }
        this.ship.visible = true;
      }
      return;
    }
    if (input.isDown('right')) {
      this.ship.rotate(0.05);
      this.ship.flames.rotate(0.05);
      this.ship.angle += 0.05;
    }
    if (input.isDown('left')) {
      this.ship.rotate(-0.05);
      this.ship.flames.rotate(-0.05);
      this.ship.angle -= 0.05;
    }
    if (input.isDown('up')) {
      this.ship.drawFlames = true;
      this.ship.addVel();
    } else {
      this.ship.drawFlames = false;
    }
  }

  generateLvl() {
    const asteroidBasedOffLevel = Math.round(10 * Math.atan(this.lvl / 25) + 3);
    for (let i = 0; i < asteroidBasedOffLevel; i += 1) {
      let randomX = -50;
      let randomY = -50;
      if (Math.random() > 0.5) {
        randomX = Math.random() * 640;
        if (Math.random() > 0.5) {
          randomY = 480 + 50;
        }
      } else {
        randomY = Math.random() * 480;
        if (Math.random() > 0.5) {
          randomX = 640 + 50;
        }
      }
      this.createAsteroid(SIZE, Math.floor(randomX), Math.floor(randomY));
    }
  }

  createAsteroid(size, xCoordinate, yCoordinate) {
    const randomAsteroid = Math.round(Math.random() * (POINTS.ASTEROIDS.length - 1));
    const asteroid = new Asteroid(POINTS.ASTEROIDS[randomAsteroid], size, xCoordinate, yCoordinate);
    this.asteroids.push(asteroid);
  }

  update() {
    // console.log(this.asteroids.length);
    this.asteroids.forEach((asteroid, asteroidIndex) => {
      asteroid.update();

      // ship collision detection
      if (this.ship.visible) {
        if (this.ship.collide(asteroid)) {
          this.ship.x = 320;
          this.ship.y = 240;
          this.ship.velocity = {
            x: 0,
            y: 0,
          };
          this.lives -= 1;
          if (this.lives <= 0) {
            this.gameOver = true;
          }
          this.ship.visible = false;
        }
      }

      // bullet loop
      this.bullets.forEach((bullet, bulletIndex) => {
        // if bullet is inside
        if (asteroid.hasPoint(bullet.x, bullet.y)) {
          switch (asteroid.size) {
            case 8:
              this.explosion(8);
              this.score += 20;
              break;
            case 4:
              this.explosion(4);
              this.score += 50;
              break;
            case 2:
              this.explosion(2);
              this.score += 100;
              break;
            default:
              break;
          }
          // remove bullet
          this.bullets.splice(bulletIndex, 1);
          // if the asteroid is big enough, split
          if (asteroid.size > 8 / 4) {
            // create two new asteroids
            for (let i = 0; i < 2; i += 1) {
              this.createAsteroid(asteroid.size / 2, asteroid.x, asteroid.y);
            }
          }
          // remove hit asteroid
          this.asteroids.splice(asteroidIndex, 1);
        }
      });
    });
    this.bullets.forEach((bullet, index, arr) => {
      bullet.update();
      if (bullet.shallRemove) {
        arr.splice(index, 1);
      }
    });
    this.ship.update();

    if (this.asteroids.length <= 0) {
      this.lvl += 1;
      this.ship.x = 320;
      this.ship.y = 240;
      this.generateLvl(this.lvl);
    }
  }
};

const Polygon = require('./Polygon');
const Bullet = require('./Bullet');

module.exports = class Ship extends Polygon {
  constructor(points, flames, size, x, y) {
    super(points);

    this.flames = new Polygon(flames);
    this.flames.scale(size);

    this.drawFlames = false;

    this.maxX = 640;
    this.maxY = 480;

    this.angle = 0;

    this.x = x;
    this.y = y;

    this.scale(size);

    this.visible = true;

    this.velocity = {
      x: 0,
      y: 0
    };
  }

  addVel() {
    // THRUST_SOUND.cloneNode(true).play();
    if ((this.velocity.x * this.velocity.x) + (this.velocity.y * this.velocity.y) < 20 * 20) {
      this.velocity.x += 0.05 * Math.cos(this.angle);
      this.velocity.y += 0.05 * Math.sin(this.angle);
    }
  }

  collide(asteroid) {
    for (let i = 0; i < this.points.length; i += 2) {
      const x = this.points[i] + this.x;
      const y = this.points[i + 1] + this.y;

      if (asteroid.hasPoint(x, y)) {
        return true;
      }
    }
    return false;
  }

  shoot(mouse) {
    const bullet = new Bullet(this.x, this.y, mouse.x, mouse.y);
    bullet.maxX = this.maxX;
    bullet.maxY = this.maxY;
    return bullet;
  }

  update() {
    this.x += this.velocity.x;
    this.y += this.velocity.y;

    this.velocity.x *= 0.99;
    this.velocity.y *= 0.99;

    if (this.x > this.maxX + 5) {
      this.x = -5;
    } else if (this.x < -5) {
      this.x = this.maxX + 5;
    }

    if (this.y > this.maxY + 5) {
      this.y = -5;
    } else if (this.y < -5) {
      this.y = this.maxY + 5;
    }
  }
};

const Polygon = require('./Polygon');

module.exports = class Asteroid extends Polygon {
  constructor(points, size, x, y) {
    super(points);

    this.maxX = 640;
    this.maxY = 480;

    this.size = size;

    this.x = x;
    this.y = y;

    this.scale(size);

    this.rotationSpeed = 0.02 * ((Math.random() * 2) - 1);

    if(Math.random() > 0.5) {
      this.rotationSpeed = -this.rotationSpeed;
    }

    const direction = 2 * Math.PI * Math.random();
    const speed = Math.random() + 1;
    this.velocity = {
      x: +(speed * Math.cos(direction)).toFixed(2),
      y: +(speed * Math.sin(direction)).toFixed(2)
    };
  }

  update() {
    // console.log(this.x, this.y);
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

  hasPoint(x, y) {
    return this.hasPoints(this.x, this.y, x, y);
  }
};

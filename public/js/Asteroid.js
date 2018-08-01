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

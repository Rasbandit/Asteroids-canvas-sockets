module.exports = class Bullet {
  constructor(x, y, mouseX, mouseY) {
    this.x = x;
    this.y = y;

    this.maxX = null;
    this.maxY = null;

    this.shallRemove = false;

    if (mouseX > x && mouseY === y) {
      this.theta = 0;
    }
    if (mouseX > x && mouseY > y) {
      this.xDif = mouseX - x;
      this.yDif = mouseY - y;
      this.theta = Math.atan(this.yDif / this.xDif);
    }
    if (mouseX === x && mouseY > y) {
      this.theta = Math.PI / 2;
    }
    if (mouseX < x && mouseY > y) {
      this.xDif = x - mouseX;
      this.yDif = mouseY - y;
      this.theta = Math.atan(this.xDif / this.yDif) + (Math.PI / 2);
    }
    if (mouseX < x && mouseY < y) {
      this.xDif = x - mouseX;
      this.yDif = y - mouseY;
      this.theta = Math.atan(this.yDif / this.xDif) + Math.PI;
    }
    if (mouseX > x && mouseY < y) {
      this.xDif = mouseX - x;
      this.yDif = y - mouseY;
      this.theta = Math.atan(this.xDif / this.yDif) + ((3 * Math.PI) / 2);
    }

    this.vel = {
      x: 5 * Math.cos(this.theta),
      y: 5 * Math.sin(this.theta)
    };
  }

  update() {
    this.prevx = this.x;
    this.prevy = this.y;
    if (this.x < 0 || this.x > this.maxX || this.y < 0 || this.y > this.maxY) {
      this.shallRemove = true;
    }

    this.x += this.vel.x;
    this.y += this.vel.y;
  }
};


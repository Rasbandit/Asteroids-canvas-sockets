import Polygon from './Polygon';

export default class Bullet extends Polygon {
  draw(ctx) {
    ctx.beginPath();
    ctx.moveTo(this.prevx, this.prevy);
    ctx.lineTo(this.x, this.y);
    ctx.stroke();
  }
}

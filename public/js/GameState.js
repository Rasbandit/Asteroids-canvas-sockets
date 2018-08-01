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

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

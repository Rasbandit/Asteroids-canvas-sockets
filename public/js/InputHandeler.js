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

module.exports = class InputHandeler {
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

    // document.addEventListener('keydown', (event) => {
    //   if (this.keys[event.keyCode]) {
    //     this.down[this.keys[event.keyCode]] = true;
    //   }
    // });

    // document.addEventListener('keyup', (event) => {
    //   if (this.keys[event.keyCode]) {
    //     this.down[this.keys[event.keyCode]] = false;
    //     this.pressed[this.keys[event.keyCode]] = false;
    //   }
    // });
  }

  keyDown(key) {
    if (this.keys[key]) {
      this.down[this.keys[key]] = true;
    }
  }

  keyUp(key) {
    if (this.keys[key]) {
      this.down[this.keys[key]] = false;
      this.pressed[this.keys[key]] = false;
    }
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
};

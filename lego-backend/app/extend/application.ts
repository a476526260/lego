const BAR = Symbol('Application#bar');
export default {
  get bar() {
    console.log(this, 'this');
    if (!this[BAR]) {
      this[BAR] = 'hello world';
    }
    return this[BAR];
  },
};

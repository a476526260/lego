import {Application} from "egg";

const BAR = Symbol('Application#bar');

export default {
  sayHi(msg:string) {
    console.log(msg)
    return msg;
    // this 就是 app 对象，在其中可以调用 app 上的其他方法，或访问属性
  },
  get bar() {
    // this 就是 app 对象，在其中可以调用 app 上的其他方法，或访问属性
    if (!this[BAR]) {
      const that = this as Application
      console.log(that, '---');
      this[BAR] = 'hello';
    }
    return this[BAR];
  },
};

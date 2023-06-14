import {GlobalErrorTypes} from "../error";
import {Controller} from "egg";

export default function validateInput(rules: any, errorType: GlobalErrorTypes) {
  return function (prototype: any, key: string, descriptor: PropertyDescriptor) {
    console.log(prototype, key)
    const originalMethod = descriptor.value;
    descriptor.value = async function (...args: any[]) {
      const that = this as Controller
      // @ts-ignore
      const {ctx, app} = that;
      const errors = app.validator.validate(rules, ctx.request.body);
      if (errors) {
        return ctx.helper.error({ctx, errorType, error: errors});
      }
      await originalMethod.apply(this, args);
    }
  }
}

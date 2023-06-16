import {Controller} from "egg";
import {GlobalErrorTypes} from "../error";

export default function checkPermission(modelName: string, errorType: GlobalErrorTypes) {
  return function(_prototype: any, _key: string, descriptor: PropertyDescriptor) {
    const originMethod = descriptor.value;
    descriptor.value = async function(...args: any[]) {
      const that = this as Controller
      // @ts-ignore
      const {ctx} = that;
      const {id} = ctx.params;
      const userId = ctx.state.user._id;
      const certainRecord = await ctx.model[modelName].findOne({id});
      if (!certainRecord || certainRecord.user.toString() !== userId) {
        return ctx.helper.error({ctx, errorType});
      }
      await originMethod.apply(this, args)
      // return certainWork.user.toString() === userId;
    }
  }
}

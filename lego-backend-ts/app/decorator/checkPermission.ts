import {Controller} from "egg";

export default function checkPermission() {
  return function(_prototype: any, _key: string, descriptor: PropertyDescriptor) {
    const originMethod = descriptor.value;
    descriptor.value = async function(...args: any[]) {
      const that = this as Controller
      // @ts-ignore
      const {ctx} = that;
      const {id} = ctx.params;
      const userId = ctx.state.user._id;
      const certainWork = await ctx.model.Work.findOne({id});
      if (!certainWork) {
        return false
      }
      await originMethod.apply(this, args)
      return certainWork.user.toString() === userId;
    }
  }
}

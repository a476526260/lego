import { Context } from 'egg';

interface Res {
  ctx: Context,
  res?: any,
  msg?: string,
}
export default {
  success({ ctx, res, msg }: Res) {
    ctx.body = {
      errNo: 0,
      data: res ? res : null,
      message: msg ? msg : '请求成功',
    };
    ctx.status = 200;
  },
};

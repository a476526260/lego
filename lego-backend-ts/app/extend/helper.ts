import { Context } from 'egg';
import { userErrorMessage } from '../controller/user';
interface SuccessResType {
  ctx: Context,
  res?: any,
  msg?: string,
}

interface ErrorResType {
  ctx: Context,
  errorType: keyof (typeof userErrorMessage)
  error?: any
}
export default {
  success({ ctx, res, msg }: SuccessResType) {
    ctx.body = {
      errNo: 0,
      data: res ? res : null,
      message: msg ? msg : '请求成功',
    };
    ctx.status = 200;
  },
  error({ ctx, errorType, error } :ErrorResType) {
    ctx.body = {
      errNo: userErrorMessage[errorType].errNo,
      message: userErrorMessage[errorType].message,
      ...(error && { error }),
    };
    ctx.status = 200;
  },
};

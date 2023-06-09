import { Context } from 'egg';
import {GlobalErrorTypes, globalErrorMessages} from '../error';
interface SuccessResType {
  ctx: Context,
  res?: any,
  msg?: string,
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
  error({ ctx, errorType, error } : {ctx: Context, errorType: GlobalErrorTypes, error?: any }) {
    ctx.body = {
      errNo: globalErrorMessages[errorType].errNo,
      message: globalErrorMessages[errorType].message,
      ...(error && { error }),
    };
    ctx.status = 200;
  },
};

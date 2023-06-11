import { Context } from 'egg';
import { userErrorMessage } from '../controller/user';
import { workErrorMessage } from '../controller/work';

interface SuccessResType {
  ctx: Context,
  res?: any,
  msg?: string,
}

interface ErrorResType {
  ctx: Context,
  errorType: keyof (typeof userErrorMessage & typeof workErrorMessage)
  error?: any
}
const globalErrorMessage = {
  ...userErrorMessage,
  ...workErrorMessage,
};
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
      errNo: globalErrorMessage[errorType].errNo,
      message: globalErrorMessage[errorType].message,
      ...(error && { error }),
    };
    ctx.status = 200;
  },
};

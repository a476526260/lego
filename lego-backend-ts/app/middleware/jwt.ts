import {Context, EggAppConfig} from "egg";

function getTokenValue(ctx) {
  // JET Header格式
  // Authorization: Bearer tokenXXX
  const {authorization} = ctx.header;
  if(!ctx.header || !authorization) {
    return false
  }
  if(typeof authorization === 'string') {
    const parts = authorization.trim().split(" ");
    if(parts.length === 2) {
      const scheme = parts[0];
      const credentials = parts[1];
      if(/^Bearer$/i.test(scheme)) {
        return credentials
      }else {
        return false
      }
    }
  }else {
    return false
  }
}

export default (options:EggAppConfig['jwt']) => {
  return async (ctx: Context, next: () => Promise<any>)=> {
    const token = getTokenValue(ctx)
    if(!token) {
      return ctx.helper.error({ctx, errorType: 'loginValidateFail'})
    }

    const {secret} = options;
    if(!secret) {
      throw new Error('secret not provided');
    }

    try {
      ctx.state.user = ctx.app.jwt.verify(token, secret)
      await next()
    }catch (e) {
      return ctx.helper.error({ctx, errorType: 'loginValidateFail'})
    }
  }
}

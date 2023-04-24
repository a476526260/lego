import { Controller } from 'egg';

const userCreateRules = {
  username: 'email',
  password: { type: 'password', min: 8 },
};

export const userErrorMessage = {
  userValidateFail: {
    errNo: 101001,
    message: '输入信息验证失败',
  },
  createUserAlreadyExists: {
    errNo: 101002,
    message: '该邮箱已经被注册，请直接登录',
  },
  loginCheckFailInfo: {
    errNo: 101003,
    message: '该用户不存在或密码正确',
  },
};
export default class UserController extends Controller {
  async createByEmail() {
    const { ctx, service, app } = this;
    const errors = app.validator.validate(userCreateRules, ctx.request.body);
    if (errors) {
      ctx.logger.warn(errors);
      return ctx.helper.error({ ctx, errorType: 'userValidateFail', error: errors });
    }
    const { username } = ctx.request.body;
    const user = await service.user.findByUserName(username);
    if (user) {
      return ctx.helper.error({ ctx, errorType: 'createUserAlreadyExists' });
    }
    const userData = await service.user.createByEmail(ctx.request.body);
    ctx.helper.success({ ctx, res: userData });
  }
  async loginByEmail() {
    const { ctx, service, app } = this;
    const errors = app.validator.validate(userCreateRules, ctx.request.body);
    if (errors) {
      ctx.logger.warn(errors);
      return ctx.helper.error({ ctx, errorType: 'loginCheckFailInfo', error: errors });
    }
    const { username, password } = ctx.request.body;
    const user = await service.user.findByUserName(username);
    if (!user) {
      return ctx.helper.error({ ctx, errorType: 'loginCheckFailInfo', error: errors });
    }
    const comparePassword = await ctx.compare(password, user.password);
    if (!comparePassword) {
      return ctx.helper.error({ ctx, errorType: 'loginCheckFailInfo' });
    }
    ctx.helper.success({ ctx, res: user, msg: '登录成功' });
  }

  async showUser() {
    const { ctx, service } = this;
    const data = await service.user.findById(ctx.params.id);
    ctx.helper.success({ ctx, res: data });
  }
}

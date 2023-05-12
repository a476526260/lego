import {Controller} from 'egg';

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
    message: '该用户不存在或密码错误',
  },
  loginValidateFail: {
    errNo: 101004,
    message: '用户未登录',
  }
};
export default class UserController extends Controller {

  checkUserInput () {
    const { ctx, app } = this;
    return app.validator.validate(userCreateRules, ctx.request.body)
  }
  async createByEmail() {
    const { ctx, service} = this;
    const errors = this.checkUserInput();
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
    ctx.helper.success({ ctx, res: userData, msg: '创建成功' });
  }
  async loginByEmail() {
    const { ctx, service} = this;
    const errors = this.checkUserInput();
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
    ctx.session.username = user.username;
    ctx.helper.success({ ctx, res: user.toJSON(), msg: '登录成功' });
  }

  async showUser() {
    const { ctx, service } = this;
    const data = await service.user.findById(ctx.params.id);
    const {username} = ctx.session
    if(!username) {
      return ctx.helper.error({ctx, errorType: 'loginValidateFail'})
    }
    ctx.helper.success({ ctx, res: {
      data,
      user: username
    }});
  }
}

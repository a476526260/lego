import {Controller} from 'egg';

const userCreateRules = {
  username: 'email',
  password: {type: 'password', min: 8},
};

const sendCodeRules = {
  phoneNumber: {type: 'string', format: /^1[3-9]\d{9}$/, message: '手机号码格式错误'}
}

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
  },
  sendVeriCodeFrequentlyFailInfo: {
    errNo: 101005,
    message: '请勿频繁获取短信验证码'
  },
  loginVeriCodeIncorrectFailInfo: {
    errNo: 101006,
    message: '验证码不正确'
  }
};
export default class UserController extends Controller {
  // 验证用户输入
  checkUserInput(rules: any) {
    const {ctx, app} = this;
    return app.validator.validate(rules, ctx.request.body)
  }

  // 发送验证码
  async sendVeriCode() {
    const {ctx, app} = this;
    const error = this.checkUserInput(sendCodeRules);
    if (error) {
      return ctx.helper.error({ctx, errorType: 'userValidateFail', error})
    }
    const {phoneNumber} = ctx.request.body
    const preVeriCode = await app.redis.get(`phoneVeriCode-${phoneNumber}`)
    if (preVeriCode) {
      return ctx.helper.error({ctx, errorType: 'sendVeriCodeFrequentlyFailInfo'})
    }
    // 生成验证码
    const veriCode = (Math.floor(Math.random() * 9000) + 1000).toString()
    await app.redis.set(`phoneVeriCode-${phoneNumber}`, veriCode, 'ex', 60)
    ctx.helper.success({ctx, res: {veriCode}})
  }

  // 手机号登录
  async loginByPhoneNumber() {
    const {ctx, app, service} = this;
    const {phoneNumber, veriCode} = ctx.request.body;
    // 检查用户输入
    const error = this.checkUserInput(sendCodeRules);
    if(error) {
      return ctx.helper.error({ctx, errorType: 'userValidateFail', error})
    }
    // 验证码是否正确
    const preVeriCode = await app.redis.get(`phoneVeriCode-${phoneNumber}`);
    if(veriCode !== preVeriCode) {
      return ctx.helper.error({ctx, errorType: 'loginVeriCodeIncorrectFailInfo', error})
    }
    const token = await service.user.loginByCellPhone(phoneNumber)
    console.log(token, "token")
    ctx.helper.success({ctx, res: {token}, msg: '登录成功'})
  }

  // 邮箱创建账号
  async createByEmail() {
    const {ctx, service} = this;
    const errors = this.checkUserInput(userCreateRules);
    if (errors) {
      ctx.logger.warn(errors);
      return ctx.helper.error({ctx, errorType: 'userValidateFail', error: errors});
    }
    const {username} = ctx.request.body;
    const user = await service.user.findByUserName(username);

    if (user) {
      return ctx.helper.error({ctx, errorType: 'createUserAlreadyExists'});
    }
    const userData = await service.user.createByEmail(ctx.request.body);
    ctx.helper.success({ctx, res: userData, msg: '创建成功'});
  }

  // 邮箱登录
  async loginByEmail() {
    const {ctx, service, app} = this;
    const errors = this.checkUserInput(userCreateRules);
    if (errors) {
      ctx.logger.warn(errors);
      return ctx.helper.error({ctx, errorType: 'loginCheckFailInfo', error: errors});
    }
    const {username, password} = ctx.request.body;
    const user = await service.user.findByUserName(username);
    if (!user) {
      return ctx.helper.error({ctx, errorType: 'loginCheckFailInfo', error: errors});
    }
    const comparePassword = await ctx.compare(password, user.password);
    if (!comparePassword) {
      return ctx.helper.error({ctx, errorType: 'loginCheckFailInfo'});
    }
    // ctx.session.username = user.username;
    const token = app.jwt.sign({username: user.username}, app.config.jwt.secret, {expiresIn: 60 * 60});
    ctx.helper.success({ctx, res: {token}, msg: '登录成功'});
  }

  //显示用户信息
  async showUser() {
    const {ctx, service,} = this;
    const userData = await service.user.findByUserName(ctx.state.user.username);
    ctx.helper.success({ctx, res: userData.toJSON()})
  }
}

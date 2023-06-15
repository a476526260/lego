import {Controller} from 'egg';
import validateInput from '../decorator/inputValidate'

const userCreateRules = {
  username: 'email',
  password: {type: 'password', min: 8},
};

const sendCodeRules = {
  phoneNumber: {type: 'string', format: /^1[3-9]\d{9}$/, message: '手机号码格式错误'},
};

const userPhoneCreateRules = {
  phoneNumber: {type: 'string', format: /^1[3-9]\d{9}$/, message: '手机号码格式错误'},
  veriCode: {type: 'string', format: /^\d{4}$/, message: '验证码格式错误'}
}

export default class UserController extends Controller {
  // 发送验证码
  @validateInput(sendCodeRules, 'userValidateFail')
  async sendVeriCode() {
    const {ctx, app} = this;
    const {phoneNumber} = ctx.request.body;
    const preVeriCode = await app.redis.get(`phoneVeriCode-${phoneNumber}`);
    if (preVeriCode) {
      return ctx.helper.error({ctx, errorType: 'sendVeriCodeFrequentlyFailInfo'});
    }
    // 生成验证码
    const veriCode = (Math.floor(Math.random() * 9000) + 1000).toString();
    await app.redis.set(`phoneVeriCode-${phoneNumber}`, veriCode, 'ex', 60);
    ctx.helper.success({ctx, res: {veriCode}});
  }

  // 手机号登录
  @validateInput(userPhoneCreateRules, 'userValidateFail')
  async loginByPhoneNumber() {
    const {ctx, app, service} = this;
    const {phoneNumber, veriCode} = ctx.request.body;

    // 验证码是否正确
    const preVeriCode = await app.redis.get(`phoneVeriCode-${phoneNumber}`);
    if (veriCode !== preVeriCode) {
      return ctx.helper.error({ctx, errorType: 'loginVeriCodeIncorrectFailInfo'});
    }
    const token = await service.user.loginByCellPhone(phoneNumber);
    ctx.helper.success({ctx, res: {token}, msg: '登录成功'});
  }

  // 邮箱创建账号
  @validateInput(userCreateRules, 'loginValidateFail')
  async createByEmail() {
    const {ctx, service} = this;
    const {username} = ctx.request.body;
    const user = await service.user.findByUserName(username);
    // 用户名是否已存在
    if (user) {
      return ctx.helper.error({ctx, errorType: 'createUserAlreadyExists'});
    }
    // 创建用户
    const userData = await service.user.createByEmail(ctx.request.body);
    ctx.helper.success({ctx, res: userData, msg: '创建成功'});
  }

  // 邮箱登录
  @validateInput(userCreateRules, 'loginValidateFail')
  async loginByEmail() {
    const {ctx, service, app} = this;
    const {username, password} = ctx.request.body;
    // 检查是否存在该用户名
    const user = await service.user.findByUserName(username);
    if (!user) {
      return ctx.helper.error({ctx, errorType: 'loginCheckFailInfo'});
    }
    // 检查密码是否正确
    const comparePassword = await ctx.compare(password, user.password);
    if (!comparePassword) {
      return ctx.helper.error({ctx, errorType: 'loginCheckFailInfo'});
    }
    // 生成token;
    const token = app.jwt.sign({username: user.username, _id: user.id}, app.config.jwt.secret, {expiresIn: 60 * 60});
    ctx.helper.success({ctx, res: {token}, msg: '登录成功'});
  }

  // 显示用户信息
  async showUser() {
    const {ctx, service} = this;
    const userData = await service.user.findByUserName(ctx.state.user.username);
    ctx.helper.success({ctx, res: userData.toJSON()});
  }
}

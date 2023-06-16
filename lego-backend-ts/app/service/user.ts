import { Service } from 'egg';
import { UserProps } from '../model/user';

export default class UserService extends Service {

  // 创建邮箱账号
  public async createByEmail(payload: UserProps) {
    const { ctx } = this;
    const { username, password } = payload;
    const hashPassword = await ctx.genHash(password);
    const userCreatedData: Partial<UserProps> = {
      username,
      password: hashPassword,
      email: username,
    };
    return await ctx.model.User.create(userCreatedData);
  }

  // 查找用户
  public findById(id: string) {
    return this.ctx.model.User.findById(id);
  }

  // 查找用户信息
  async findByUserName(username: string) {
    return this.ctx.model.User.findOne({ username });
  }

  // 手机号登录
  async loginByCellPhone(phoneNumber: string) {
    const { ctx, app } = this;
    const user = await this.findByUserName(phoneNumber);
    if (user) {
      const token = app.jwt.sign({ username: user.username, _id: user._id }, app.config.jwt.secret, { expiresIn: 60 * 60 });
      return token;
    }

    const userCreatedData: Partial<UserProps> = {
      username: phoneNumber,
      phoneNumber,
      nickName: `lego-${phoneNumber.slice(-4)}`,
      type: 'cellphone',
    };
    const newUser = await ctx.model.User.create(userCreatedData);
    const token = app.jwt.sign({ username: newUser.username, _id: user._id }, app.config.jwt.secret, { expiresIn: 60 * 60 });
    return token;
  }
}

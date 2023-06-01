import { Service } from 'egg';
import { UserProps } from '../model/user';

export default class UserService extends Service {
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
  public findById(id:string) {
    return this.ctx.model.User.findById(id);
  }

  async findByUserName(username: string) {
    return this.ctx.model.User.findOne({ username });
  }

  async loginByCellPhone(phoneNumber: string) {
    const {ctx, app} = this;
    const user = await this.findByUserName(phoneNumber);
    if(user) {
      const token = app.jwt.sign({username: user.username}, app.config.jwt.secret, {expiresIn: 60 * 60})
      return token
    }

    const userCreatedData: Partial<UserProps> = {
      username: phoneNumber,
      phoneNumber: phoneNumber,
      nickName: `lego-${phoneNumber.slice(-4)}`,
      type: 'cellphone',
    }
    const newUser = await ctx.model.User.create(userCreatedData)
    const token = app.jwt.sign({username: newUser.username}, app.config.jwt.secret, {expiresIn: 60 * 60})
    return token
  }
}

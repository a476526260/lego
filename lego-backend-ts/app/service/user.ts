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
}
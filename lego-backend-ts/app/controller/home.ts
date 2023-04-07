import { Controller } from 'egg';

export default class HomeController extends Controller {
  public async index() {
    const { ctx } = this;
    ctx.helper.foo('hello');
    console.log(ctx.app.bar);
    ctx.body = await ctx.service.test.sayHi('egg');
  }
}

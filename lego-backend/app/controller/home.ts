import { Controller } from 'egg';

export default class HomeController extends Controller {
  async index() {
    const { ctx } = this;
    // ctx.body = await ctx.service.test.sayHi('egg');
    // ctx.status = 200;
    console.log(this.app, 'app');
    ctx.logger.error('this is error message');
    ctx.helper.success({
      ctx,
      res: {
        list: [],
      },
      msg: 'hello world --',
    });
  }

  async getImageSrc() {
    const { ctx } = this;
    await ctx.render('test.nj', { url: 'https://t12.baidu.com/it/u=4285827287,73607252&fm=58' });
  }
}

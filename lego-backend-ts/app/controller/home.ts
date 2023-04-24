import { Controller } from 'egg';
export default class HomeController extends Controller {
  public async index() {
    const { ctx } = this;
    ctx.helper.success({ ctx, res: [{ id: 1, name: 'dennyzhou', age: 30 }, { id: 2, name: 'doris', age: 29 }] });
  }
}

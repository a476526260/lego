import {Controller} from 'egg';

const infoList = [
  {id: 1, name: 'denny', age: 30},
  {id: 2, name: 'doris', age: 18},
  {id: 3, name: 'david', age: 33},
  {id: 4, name: 'white', age: 27},
  {id: 5, name: 'black', age: 29},
  {id: 6, name: 'rose', age: 31},
  {id: 7, name: 'jerry', age: 40},
]
export default class HomeController extends Controller {
  public async index() {
    const {ctx} = this;
    ctx.helper.success({ctx, res: infoList, msg: '数据加载成功'});
  }
}

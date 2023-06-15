import { Controller } from 'egg';
import validateInput from '../decorator/inputValidate'
const workCreateRule = {
  title: 'string',
};

export default class WorkController extends Controller {
  // 创建模板
  @validateInput(workCreateRule, 'workValidateFail')
  async createWork() {
    const { ctx, service } = this;
    const workData = await service.work.createEmptyWork(ctx.request.body);
    ctx.helper.success({ ctx, res: workData });
  }
}

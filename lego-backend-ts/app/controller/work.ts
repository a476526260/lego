import { Controller } from 'egg';

const workCreateRule = {
  title: 'string',
};


export const workErrorMessage = {
  workValidateFail: {
    errNo: 10201,
    message: '输入信息验证失败',
  },
};

export default class WorkController extends Controller {
  validateUserInput(rule: any) {
    const { ctx, app } = this;
    const errors = app.validator.validate(rule, ctx.request.body);
    ctx.logger.warn(errors);
    return errors;
  }

  async createWork() {
    const { ctx, service } = this;
    const errors = this.validateUserInput(workCreateRule);
    if (errors) {
      return ctx.helper.error({ ctx, errorType: 'workValidateFail', error: errors });
    }

    const workData = await service.work.createEmptyWork(ctx.request.body);
    ctx.helper.success({ ctx, res: workData });

  }
}

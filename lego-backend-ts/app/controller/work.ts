import {Controller} from 'egg';
import validateInput from '../decorator/inputValidate';
import checkPermission from "../decorator/checkPermission";

const workCreateRule = {
  title: 'string',
};

export interface IndexCondition {
  pageIndex?: number;
  pageSize?: number;
  select?: string | string[];
  populate?: { path?: string; select?: string } | string;
  customSort?: Record<string, any>;
  find?: Record<string, any>;
}

export default class WorkController extends Controller {
  // 创建模板
  @validateInput(workCreateRule, 'workValidateFail')
  async createWork() {
    const {ctx, service} = this;
    const workData = await service.work.createEmptyWork(ctx.request.body);
    ctx.helper.success({ctx, res: workData});
  }

  async myList() {
    const {ctx} = this
    const userId = ctx.state.user._id
    const {pageIndex, pageSize, isTemplate, title} = ctx.query
    const findCondition = {
      user: userId,
      ...(title && {title: {$regex: title, $options: 'i'}}),
      ...(isTemplate && {isTemplate: !!parseInt(isTemplate)})
    }
    const listCondition: IndexCondition = {
      select: 'id author copiedCount coverImg desc title user isHot createdAt',
      populate: {path: 'user', select: 'username nickName picture'},
      find: findCondition,
      ...(pageIndex && {pageIndex: parseInt(pageIndex)}),
      ...(pageSize && {pageSize: parseInt(pageSize)})
    }
    const res = await ctx.service.work.getList(listCondition)
    ctx.helper.success({ctx, res})
  }

  @checkPermission('Work', 'workNoPermissionFail')
  async update() {
    const {ctx} = this;
    const {id} = ctx.params;
    const payload = ctx.request.body;
    const res = await ctx.model.Work.findOneAndUpdate({id}, payload, {new: true}).lean()
    ctx.helper.success({ctx, res})
  }

  @checkPermission('Work', 'workNoPermissionFail')
  async delete() {
    const {ctx} = this;
    const {id} = ctx.params;
    const res = await ctx.model.Work.findOneAndDelete({id}).select('_id id title').lean()
    ctx.helper.success({ctx, res})
  }

  @checkPermission('Work', 'workNoPermissionFail')
  async publish(isTemplate: boolean) {
    const {ctx} = this;
    const {id} = ctx.params;
    const url = await ctx.service.work.publish(id, isTemplate);
    console.log(url, 'url')
    ctx.helper.success({ctx, res: url});
  }

  // 发布作品
  async publishWork() {
    await this.publish(false)
  }
  // 发布模板
  async publishTemplate() {
    await this.publish(true)
  }
}

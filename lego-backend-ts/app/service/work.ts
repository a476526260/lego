import { Service } from 'egg';
import { nanoid } from 'nanoid';
import { Types } from 'mongoose';
import { WorkProps } from '../model/work';

export default class WorkService extends Service {
  async createEmptyWork(payload) {
    const { ctx } = this;
    const { username, _id } = ctx.state.user;
    console.log(username, _id);
    const uuid = nanoid(6);

    const newEmptyWork: Partial<WorkProps> = {
      ...payload,
      user: Types.ObjectId(_id),
      author: username,
      uuid,
    };
    return ctx.model.Work.create(newEmptyWork);
  }
}
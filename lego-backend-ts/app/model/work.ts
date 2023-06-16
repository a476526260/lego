import { Application } from 'egg';
import { ObjectId } from 'mongoose';
import AutoIncrementFactory from 'mongoose-sequence';

export interface WorkProps {
  id?: number;
  uuid: string;
  title: string;
  desc: string;
  coverImg?: string;
  content?: { [key: string]: any };
  isTemplate?: boolean;
  isPublic?: boolean;
  isHot?: boolean;
  author: string;
  copiedCount: number;
  status?: 0 | 1 | 2;
  user: ObjectId;
}

module.exports = (app: Application) => {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;
  const AutoIncrement = AutoIncrementFactory(mongoose);
  const WorkSchema = new Schema<WorkProps>({
    title: { type: String },
    desc: { type: String },
    coverImg: { type: String },
    content: { type: String },
    isTemplate: { type: Boolean },
    isPublic: { type: Boolean },
    isHot: { type: Boolean },
    copiedCount: { type: Number, default: 0 },
    status: { type: Number, default: 1 },
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    author: { type: String },
    uuid: { type: String, unique: true },
  }, { timestamps: true, collection: 'work'});

  WorkSchema.plugin(AutoIncrement, { inc_field: 'id', id: 'works_id' });
  return mongoose.model<WorkProps>('Work', WorkSchema);
};

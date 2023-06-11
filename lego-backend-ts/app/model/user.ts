import { Application } from 'egg';
import AutoIncrementFactory from 'mongoose-sequence';

export interface UserProps {
  username: string,
  password: string,
  email?: string,
  nickName?: string,
  picture?: string,
  phoneNumber?: string,
  createdAt: Date,
  updatedAt: Date,
  type: 'email' | 'cellphone'
}

function initUserModel(app: Application) {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;
  const AutoIncrement = AutoIncrementFactory(mongoose);
  const UserSchema = new Schema<UserProps>({
    username: { type: String, unique: true, required: true },
    password: { type: String },
    nickName: { type: String },
    email: { type: String },
    picture: { type: String },
    phoneNumber: { type: String },
    type: { type: String, default: 'email' },
  }, {
    timestamps: true, // 如果出现timestamps相关的报错，可能是由于mongoose版本不兼容导致的，需重新安装依赖
    collection: 'user',
    toJSON: {
      transform(_doc, ret) {
        delete ret.password;
        delete ret.__v;
      },
    },
  });

  UserSchema.plugin(AutoIncrement, { inc_field: 'id', id: 'users_id' });

  return app.mongoose.model<UserProps>('User', UserSchema);
}

export default initUserModel;

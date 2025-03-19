import { model, Schema } from 'mongoose';
import { TUser } from './user.interface';
import config from '../../config';
import bcrypt from 'bcrypt';

const userSchema = new Schema<TUser>(
  {
    id: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    needsPasswordChange: {
      type: Boolean,
      default: true,
    },
    role: {
      type: String,
      enum: ['admin', 'student', 'faculty'],
    },
    status: {
      type: String,
      enum: ['in-progress', 'blocked'],
      default: 'in-progress',
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

// _________________________________  middleware/hook (when we will do something on schema) this will work on create() or save() function
// Document Middleware
// Pre save middleware
userSchema.pre('save', async function (next) {
  // console.log(this, 'pre hook: we will save the data');

  // hashing password and save into db
  // eslint-disable-next-line @typescript-eslint/no-this-alias
  const user = this;
  // password field er data niye change kore abr password field e set kore dicci
  user.password = await bcrypt.hash(
    user.password,
    Number(config.bcrypt_salt_round),
  );
  next();
});
// Post save middleware
//Post Save Hook/Middleware
userSchema.post('save', function (doc, next) {
  doc.password = '';
  // console.log(this, 'post hook : we saved our the data');
  next();
});

export const User = model<TUser>('Users', userSchema);

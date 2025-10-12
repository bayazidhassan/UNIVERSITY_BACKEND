import bcrypt from 'bcrypt';
import { Schema, model } from 'mongoose';
import config from '../../config';
import { TStatus, TUser, TUserRole, userModel } from './user_interface';

const userRole: TUserRole[] = ['student', 'faculty', 'admin'];
const status: TStatus[] = ['in_progress', 'block'];

//export const userSchema = new Schema<TUser>(
export const userSchema = new Schema<TUser, userModel>( //for custom static method
  {
    id: {
      type: String,
      required: [true, 'User ID is required'],
      unique: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      select: false,
    },
    needPasswordChange: {
      type: Boolean,
      default: true,
    },
    passwordChangedAt: {
      type: Date,
    },
    role: {
      type: String,
      //enum: ['student', 'faculty', 'admin'],
      enum: {
        values: userRole,
        message: 'User role must be student, faculty or admin',
      },
      required: [true, 'User role is required'],
    },
    status: {
      type: String,
      //enum: ['in_progress', 'block'],
      enum: {
        values: status,
        message: 'Status must be is_progress or block',
      },
      default: 'in_progress',
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

//document middleware/hook
//Note: The create() function fires save() hooks.
userSchema.pre('save', async function (next) {
  //here 'this' refers to the current document

  /*
  this.isModified('password') returns true only if the password field was changed (or newly set).
  If the password has not been modified, then hashing again is unnecessary.
  this.isModified('password') returns true only if the password field was changed (or newly set).
  If the password has not been modified, then hashing again is unnecessary.
  That check prevents double-hashing and ensures passwords are only hashed when they are actually changed.
  */
  if (!this.isModified('password')) {
    return next();
  }

  const hashed = await bcrypt.hash(this.password, Number(config.bcrypt_salt));
  this.password = hashed;
  //next(); //If you use async → don’t use next(), If you use next() → don’t use async
});

//document middleware/hook
//Note: The create() function fires save() hooks.
/*
You don’t need next() unless you specifically want to chain multiple post('save') hooks.
Older versions of Mongoose required next in both pre and post hooks.
Nowadays (Mongoose 5.x+ and 6.x+), you only need next in pre hooks.
In post hooks, including next does nothing — Mongoose ignores it.
*/
/*
//userSchema.post('save', async function (doc, next) {
userSchema.post('save', async function (doc) {
  //here 'this' or 'doc' refers to the saved document
  
  //doc.password = ''; //I have implemented a logic in the service page to do not send password field in the returned doc
  
  //next();
});
*/

/*
//query middleware/hook
userSchema.pre('find', function (next) {
  //this.where({ isDeleted: { $ne: true } });
  //this.where({ status: { $eq: 'in_progress' } });
  this.where({ isDeleted: { $ne: true }, status: { $eq: 'in_progress' } });
  next();
});

userSchema.pre('findOne', function (next) {
  //this.where({ isDeleted: { $ne: true } });
  //this.where({ status: { $eq: 'in_progress' } });
  this.where({ isDeleted: { $ne: true }, status: { $eq: 'in_progress' } });
  next();
});

userSchema.pre('findOneAndUpdate', function (next) {
  //this.where({ isDeleted: { $ne: true } });
  //this.where({ status: { $eq: 'in_progress' } });
  this.where({ isDeleted: { $ne: true }, status: { $eq: 'in_progress' } });
  next();
});
*/

userSchema.pre(['find', 'findOne', 'findOneAndUpdate'], function (next) {
  //this.where({ isDeleted: { $ne: true } });
  //this.where({ status: { $eq: 'in_progress' } });
  this.where({ isDeleted: { $ne: true }, status: { $eq: 'in_progress' } });
  next();
});

//custom static method
userSchema.static('isUserExists', async function (id: string) {
  //return await User.findOne({ id: id }).select('+password');
  return await User.findOne({ id }).select('+password'); //es6 style
  //password-> just give password field
  //+password-> give whole document with password field
});

userSchema.static(
  'isPasswordMatched',
  async function (password: string, hashPassword: string) {
    return await bcrypt.compare(password, hashPassword);
  },
);

//export const User = model<TUser>('User', userSchema);
export const User = model<TUser, userModel>('User', userSchema); //for custom static method

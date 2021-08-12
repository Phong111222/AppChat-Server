import mongoose, { Schema } from 'mongoose';
import bcrypt from 'bcryptjs';

export const UserSchema = new mongoose.Schema(
  {
    name: {
      required: true,
      type: String,
    },
    nickname: {
      type: String,
      default: '',
    },
    password: {
      require: true,
      type: String,
      minlength: [8, 'password must have at least 8 characters'],
    },
    rooms: {
      type: [Schema.Types.ObjectId],
      ref: 'rooms',
    },
    friends: {
      type: [Schema.Types.ObjectId],
      ref: 'users',
    },
    friendRequests: {
      type: [Schema.Types.ObjectId],
      ref: 'users',
    },
    gender: {
      required: true,
      type: String,
      enum: ['male', 'female'],
    },
    email: {
      require: true,
      type: String,
      unique: true,
      validate: {
        validator: function (email) {
          return /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(
            email
          );
        },
        message: 'Invalid Email',
      },
    },
  },
  {
    timestamps: true,
  }
);

UserSchema.pre('save', async function (next) {
  const user = this;

  if (!user.isModified('password')) return next();
  const salt = await bcrypt.genSalt();
  const hashPass = await bcrypt.hash(user.password, salt);
  user.password = hashPass;
  next();
});

export default mongoose.model('users', UserSchema);

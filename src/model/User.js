import mongoose, { Schema } from 'mongoose';
import bcrypt from 'bcryptjs';
const UserSchema = new mongoose.Schema(
  {
    name: {
      required: true,
      type: String,
    },
    password: {
      require: true,
      type: String,
      minlength: [8, 'password must have at least 8 characters'],
    },
    messages: {
      type: [Schema.Types.ObjectId],
      ref: 'messages',
      default: [],
    },
    email: {
      require: true,
      type: String,
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

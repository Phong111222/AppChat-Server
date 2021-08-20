import { Schema, model } from 'mongoose';
import { UserSchema } from './User';
const SenderSchema = new Schema(
  {
    name: {
      type: String,
    },
    _id: {
      type: String,
    },
    nickname: {
      type: String,
    },
  },
  {
    timepstamps: true,
  }
);
const MessageSchema = new Schema(
  {
    text: {
      type: String,
    },
    room: {
      type: Schema.Types.ObjectId,
      ref: 'rooms',
      required: true,
    },
    sender: {
      type: SenderSchema,

      required: true,
    },

    files: {
      type: [String],
    },
    images: {
      type: [String],
    },
  },
  {
    timestamps: true,
  }
);

export default model('messages', MessageSchema);

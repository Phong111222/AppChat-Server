import { Schema, model } from 'mongoose';

const MessageSchema = new Schema(
  {
    text: {
      type: String,
    },
    room: {
      type: Schema.Types.ObjectId,
      ref: 'rooms',
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'users',
    },
    file: {
      type: String,
    },
    image: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('messages', MessageSchema);

import mongoose, { Schema } from 'mongoose';

const RoomSchema = new mongoose.Schema(
  {
    roomName: {
      type: String,
    },
    users: {
      type: [Schema.Types.ObjectId],
      ref: 'users',
    },
    roomType: {
      type: String,
      enum: ['Group', 'Single'],
    },
    messages: {
      type: [Schema.Types.ObjectId],
      ref: 'messages',
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('rooms', RoomSchema);

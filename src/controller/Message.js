import AsyncMiddleware from '../middleware/asyncMiddleware';
import Message from '../model/Message';
import ErrorResponse from '../model/response/ErrorResponse';
import SuccessResponse from '../model/response/SuccessResponse';
import Room from '../model/Room';
import { EncryptMessage } from '../utils/encrypt';

export const CreateSingleMessage = AsyncMiddleware(async (req, res, next) => {
  const { text, file, image } = req.body;
  const { roomId } = req.params;

  const room = await Room.findById(roomId);
  if (!room) {
    return next(new ErrorResponse(400, 'Room is not found'));
  }

  if (!room.users.includes(req.user._id.toString())) {
    return next(
      new ErrorResponse(400, `You don't have permission in this room`)
    );
  }
  let newMessage = null;
  if (!(text || image || file)) {
    return next(new ErrorResponse(400, 'Message does not have content'));
  }
  const user = {
    name: req.user.name,
    nickname: req.user.nickname,
    _id: req.user._id,
  };
  if (text) {
    newMessage = new Message({
      sender: user,
      room: roomId,
      text: EncryptMessage(text, `${roomId} ${process.env.secretEncrypt}`),
    });
  }
  if (file) {
    newMessage = new Message({ sender: user, room: roomId, file });
  }
  if (image) {
    newMessage = new Message({ sender: user, room: roomId, image });
  }

  const savedMessage = await newMessage.save();
  room.messages.push(savedMessage._id);
  await room.save();
  res.status(200).json(new SuccessResponse(200, savedMessage));
});

export const GetSingleRoomMessages = AsyncMiddleware(async (req, res, next) => {
  const { roomId } = req.params;
  const { numberOfMessages } = req.query;
  const room = await Room.findById(roomId).populate('messages');

  if (!room) {
    return next(new ErrorResponse(400, 'Room does not exist'));
  }

  if (!room.users.includes(req.user._id.toString())) {
    return next(
      new ErrorResponse(403, "You don't have permission in this room")
    );
  }
  if (parseInt(numberOfMessages) < 0) {
    return next(new ErrorResponse(400, 'numberOfMessages must be positive'));
  }
  const messagesData = await Message.find({ room: roomId })
    .sort([['createdAt', -1]])
    .skip(parseInt(numberOfMessages) === 1 ? 0 : parseInt(numberOfMessages) - 1)
    .limit(10);
  const messages = [...messagesData];
  res
    .status(200)
    .json(new SuccessResponse(200, { messages: messages.reverse() }));
});

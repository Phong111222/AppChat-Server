import AsyncMiddleware from '../middleware/AsyncMiddleware';
import Room from '../model/Room';
import User from '../model/User';
import ErrorResponse from '../model/response/ErrorResponse';
import SuccessResponse from '../model/response/SuccessResponse';
import { CheckSingleRoomExist } from '../utils/checkExistRoom';

export const CreateSingleRoom = AsyncMiddleware(async (req, res, next) => {
  const { userId1, userId2, roomType } = req.body;

  const user1 = await User.findById(userId1).populate(
    'rooms',
    'users roomType'
  );
  const user2 = await User.findById(userId2).populate(
    'rooms',
    'users roomType'
  );

  if (!user1) {
    return next(new ErrorResponse(400, `User1 is not found`));
  }
  if (!user2) {
    return next(new ErrorResponse(400, `User2 is not found`));
  }

  const user1SingleRooms = user1.rooms.filter((r) => r.roomType === 'Single');
  const user2SingleRooms = user2.rooms.filter((r) => r.roomType === 'Single');

  const checkArr = [userId1, userId2];

  if (CheckSingleRoomExist(user1SingleRooms, checkArr)) {
    return next(new ErrorResponse(400, 'This room existed'));
  }
  if (CheckSingleRoomExist(user2SingleRooms, checkArr)) {
    return next(new ErrorResponse(400, 'This room existed'));
  }
  const newRoom = new Room({ users: checkArr, roomType });
  const savedRoom = await newRoom.save();
  user1.rooms.push(savedRoom._id);
  user2.rooms.push(savedRoom._id);
  await user1.save();
  await user2.save();
  res.status(200).json(savedRoom);
});

export const GetSingleRoom = AsyncMiddleware(async (_, res, __) => {
  const rooms = await Room.find({ roomType: { $eq: 'Single' } }).populate(
    'messages users',
    '-password -createdAt -updatedAt'
  );

  res.status(200).json(new SuccessResponse(200, rooms));
});

export const GetRoomInfo = AsyncMiddleware(async (req, res, next) => {
  const { roomId } = req.params;
  const room = Room.findById(roomId).select('-__v -createdAd -updatedAt');
  if (!room) return next(new ErrorResponse(400, 'Room does not exist'));
  res.status(200).json(new SuccessResponse(200, room));
});

export const DeleteRoom = AsyncMiddleware(async (req, res, next) => {
  const { roomId } = req.params;
});

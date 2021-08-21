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
  res.status(200).json(new SuccessResponse(200, { newRoom: savedRoom }));
});

export const GetAllSingleRooms = AsyncMiddleware(async (_, res, __) => {
  const rooms = await Room.find({ roomType: { $eq: 'Single' } }).populate({
    path: 'users messages',
    populate: {
      path: 'rooms',
    },
  });

  res.status(200).json(new SuccessResponse(200, { rooms }));
});

export const GetAllSingleRoomsByUser = AsyncMiddleware(
  async (req, res, next) => {
    const { userId } = req.params;
    const user = await User.findById(userId).populate({
      path: 'rooms',
      populate: {
        path: 'users messages',
        select: '-password',
      },
    });
    if (!user) {
      next(new ErrorResponse(400, 'User is not found'));
    }
    const SingleRoomsOfUser = user.rooms;
    res
      .status(200)
      .json(new SuccessResponse(200, { rooms: SingleRoomsOfUser }));
  }
);

export const GetRoomInfo = AsyncMiddleware(async (req, res, next) => {
  const { roomId } = req.params;
  const room = await Room.findById(roomId).select('-__v -createdAd -updatedAt');
  if (!room) return next(new ErrorResponse(400, 'Room does not exist'));
  res.status(200).json(new SuccessResponse(200, room));
});
// Make room with type group
export const CreateGroupRoom = AsyncMiddleware(async (req, res, next) => {
  const { userList, roomType } = req.body;
  const users = await User.find().select('_id');
  const usersListId = [];
  users.forEach((user) => usersListId.push(user._id.toString()));
  let check = [];

  userList.forEach((user) => {
    if (!usersListId.includes(user)) {
      check.push(user);
    }
  });
  if (check.length > 0) {
    return next(new ErrorResponse(400, `${check.join(', ')} is not found`));
  }
  const newRoom = new Room({ users: userList, roomType });
  const savedRoom = await newRoom.save();
  // res.status(200).json(new SuccessResponse(200, {}));
  for (let u of userList) {
    const user = await User.findById(u);
    user.rooms.push(savedRoom._id);
    await user.save();
  }
  res.status(200).json(new SuccessResponse(200, savedRoom));
});

export const AddUsersIntoGroup = AsyncMiddleware(async (req, res, next) => {
  const { users } = req.body;
  const { roomId } = req.params;
  const room = await Room.findById(roomId);

  const existUsers = [];
  for (const user of users) {
    const checkUser = await User.findById(user);

    if (!checkUser) {
      existUsers.push(user);
    }
  }

  if (existUsers.length > 0) {
    return next(new ErrorResponse(400, `${existUsers.join(', ')} not exist`));
  }

  if (!room) {
    return next(new ErrorResponse(400, 'Room is not exist'));
  }
  let check = false;
  const usersInRoom = room.users.map((user) => user.toString());
  users.forEach((user) => {
    if (usersInRoom.includes(user)) {
      check = true;
    }
  });
  if (check) {
    return next(new ErrorResponse(400, 'Users have been in this room'));
  }
  room.users = [...room.users, ...users];

  const rs = await room.save();

  return res.status(200).json(new SuccessResponse(200, { updatedRoom: rs }));
});

import AsyncMiddleware from '../middleware/AsyncMiddleware';
import SuccessResponse from '../model/response/SuccessResponse';
import User from '../model/User';
import bcrypt from 'bcryptjs';
import ErrorResponse from '../model/response/ErrorResponse';
import getRandomArbitrary from '../utils/getRandomNumber';

export const GetUserList = AsyncMiddleware(async (_, res, next) => {
  const users = await User.find()
    .populate('rooms', '_id users roomType messages')
    .select('-__v -createdAt -updatedAt');

  return res.status(200).json(new SuccessResponse(200, { users }));
});

export const UpdatePassword = AsyncMiddleware(async (req, res, next) => {
  const { user } = req;
  const { password, new_password } = req.body;
  const { userID } = req.params;
  const checkUser = await User.findById(userID);
  if (!checkUser) {
    return next(new ErrorResponse(400, 'User is not found'));
  }
  if (checkUser._id.toString() !== user._id.toString()) {
    return next(
      new ErrorResponse(403, 'You do not have permission in this route')
    );
  }
  const comparePassword = await bcrypt.compare(password, user.password);
  if (!comparePassword) {
    return next(new ErrorResponse(400, 'Wrong password'));
  }
  user.password = new_password;
  const rs = await user.save();
  res.status(201).json(new SuccessResponse(201, { rs }));
});

export const GetUserInfo = AsyncMiddleware(async (req, res, next) => {
  const { userId } = req.params;
  const user = await User.findById(userId)
    .populate('rooms friends', '-password')
    .select('-password');
  if (!user) {
    return next(new ErrorResponse(400, 'User is not found'));
  }
  res.status(200).json(new SuccessResponse(200, user));
});

export const GetRandomSuggestFriends = AsyncMiddleware(
  async (req, res, next) => {
    const users = await User.find({
      _id: { $ne: req.user._id.toString() },
    }).select('-password');
    let friendsSuggesst = users.filter(
      (ele) => !req.user.friends.includes(ele._id)
    );

    const randomNum = getRandomArbitrary(0, friendsSuggesst.length) + 8;
    if (friendsSuggesst.length > randomNum) {
      friendsSuggesst.slice(randomNum - 8, randomNum);
    }
    res.status(200).json(new SuccessResponse(200, friendsSuggesst));
  }
);

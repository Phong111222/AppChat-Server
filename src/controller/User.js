import AsyncMiddleware from '../middleware/AsyncMiddleware';
import SuccessResponse from '../model/response/SuccessResponse';
import User from '../model/User';
import bcrypt from 'bcryptjs';
import ErrorResponse from '../model/response/ErrorResponse';
import getRandomArbitrary from '../utils/getRandomNumber';
import { Shuffle } from '../utils/func';
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
  const compareNewPassowrd = await bcrypt.compare(new_password, user.password);
  if (compareNewPassowrd) {
    return next(new ErrorResponse(400, 'You are using this password'));
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
    const user = req.user;
    const users = await User.find({
      _id: { $ne: req.user._id.toString() },
    }).select('-password');
    let friendsSuggest = users.filter(
      (ele) => !req.user.friends.includes(ele._id)
    );

    friendsSuggest = friendsSuggest.filter(
      (u) => !user.friendRequests.includes(u._id.toString())
    );

    res.status(200).json(
      new SuccessResponse(200, {
        friendsSuggest: Shuffle(friendsSuggest).slice(0, 8),
      })
    );
  }
);

export const GetListFriends = AsyncMiddleware(async (req, res, next) => {
  const user = await User.findById(req.user._id.toString()).populate({
    path: 'friends',
    select: '-password',
  });

  res.status(200).json(new SuccessResponse(200, { friends: user.friends }));
});

export const GetListFriendRequests = AsyncMiddleware(async (req, res, next) => {
  const user = req.user;
  res
    .status(200)
    .json(new SuccessResponse(200, { friendRequests: user.friendRequests }));
});

export const FindUser = AsyncMiddleware(async (req, res, next) => {
  const { email } = req.body;
  const user = await User.findOne({ email }).select('-password');
  if (!user) {
    return next(new ErrorResponse(400, 'User is not found'));
  }
  res.status(200).json(new SuccessResponse(200, user));
});

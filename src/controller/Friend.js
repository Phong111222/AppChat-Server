import AsyncMiddleware from '../middleware/AsyncMiddleware';
import ErrorResponse from '../model/response/ErrorResponse';
import SuccessResponse from '../model/response/SuccessResponse';
import User from '../model/User';

export const SendFriendRequest = AsyncMiddleware(async (req, res, next) => {
  const { userId } = req.params;
  const user = req.user;
  const userSend = User.findById(userId);
  if (userId === user._id.toString()) {
    return next(new ErrorResponse(400, 'Can not make friend with yourself'));
  }
  if (!userSend) {
    return next(new ErrorResponse(400, `User is not found`));
  }
  const checkFriendRequest = user.friendRequests.includes(userId);
  if (checkFriendRequest) {
    return next(new ErrorResponse(400, 'This request was send'));
  }

  user.friendRequests.push(userId);
  const rs = await req.user.save();
  res.status(200).json(new SuccessResponse(200, rs));
});

export const AcceptFriendRequest = AsyncMiddleware(async (req, res, next) => {
  const { userId } = req.params;
  const user = req.user;
  const userSend = await User.findById(userId);
  if (userId === user._id.toString()) {
    return next(new ErrorResponse(400, 'Can not make friend with yourself'));
  }
  if (!userSend) {
    return next(new ErrorResponse(400, `User is not found`));
  }
  const checkFriendRequest = user.friendRequests.includes(userId);
  if (!checkFriendRequest) {
    return next(new ErrorResponse(400, 'This request is not exist'));
  }

  user.friendRequests = user.friendRequests.filter(
    (request) => request.toString() !== userId
  );

  user.friends.push(userId);
  userSend.friends.push(user._id);
  const rs = await req.user.save();
  await userSend.save();
  res.status(200).json(new SuccessResponse(200, rs));
});

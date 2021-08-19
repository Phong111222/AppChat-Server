import AsyncMiddleware from '../middleware/AsyncMiddleware';
import ErrorResponse from '../model/response/ErrorResponse';
import SuccessResponse from '../model/response/SuccessResponse';
import User from '../model/User';

export const SendFriendRequest = AsyncMiddleware(async (req, res, next) => {
  const { userId } = req.params;
  const user = req.user;
  const userRecievedFriendRequest = await User.findById(userId);
  const checkFriend =
    user.friends.includes(userId) ||
    userRecievedFriendRequest.friends.includes(user._id.toString());

  if (checkFriend) {
    return next(
      new ErrorResponse(400, ' You have been friend with this user ')
    );
  }

  if (userId === user._id.toString()) {
    return next(new ErrorResponse(400, 'Can not make friend with yourself'));
  }
  if (!userRecievedFriendRequest) {
    return next(new ErrorResponse(400, `User is not found`));
  }
  const checkFriendRequest = userRecievedFriendRequest.friendRequests.includes(
    user._id.toString()
  );
  if (checkFriendRequest) {
    return next(new ErrorResponse(400, 'This request was send'));
  }

  userRecievedFriendRequest.friendRequests.push(user._id);
  const rs = await userRecievedFriendRequest.save();
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
  const checkFriendRequest = user.friendRequests.find(
    (request) => request._id.toString() === userId
  );
  if (!checkFriendRequest) {
    return next(new ErrorResponse(400, 'This request is not exist'));
  }

  user.friendRequests = user.friendRequests.filter(
    (request) => request._id.toString() !== userId
  );

  user.friends.push(userId);
  userSend.friends.push(user._id);
  const rs = await req.user.save();
  await userSend.save();
  res.status(200).json(new SuccessResponse(200, rs));
});

export const DeleteFriendRequest = AsyncMiddleware(async (req, res, next) => {
  const { userId } = req.params;
  const user = req.user;
  const userSend = await User.findById(userId);
  if (userId === user._id.toString()) {
    return next(new ErrorResponse(400, 'Can not delete yourself'));
  }
  if (!userSend) {
    return next(new ErrorResponse(400, `User is not found`));
  }
  const checkFriendRequest = user.friendRequests.find(
    (request) => request._id.toString() === userId
  );
  // console.log(user.friendRequests);
  if (!checkFriendRequest) {
    return next(new ErrorResponse(400, 'This request is not exist'));
  }

  user.friendRequests = user.friendRequests.filter(
    (request) => request._id.toString() !== userId
  );

  const rs = await req.user.save();
  await userSend.save();
  res.status(200).json(new SuccessResponse(200, rs));
});

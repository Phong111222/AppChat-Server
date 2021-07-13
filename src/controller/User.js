import AsyncMiddleware from '../middleware/AsyncMiddleware';
import SuccessResponse from '../model/response/SuccessResponse';
import User from '../model/User';
import bcrypt from 'bcryptjs';
import ErrorResponse from '../model/response/ErrorResponse';
export const GetUserList = AsyncMiddleware(async (_, res, next) => {
  const users = await User.find();
  return res.status(200).json(new SuccessResponse(200, { users }));
});

export const UpdatePassword = AsyncMiddleware(async (req, res, next) => {
  const { user } = req;
  const { password, new_password } = req.body;
  const comparePassword = await bcrypt.compare(password, user.password);
  if (!comparePassword) {
    return next(new ErrorResponse(400, 'Wrong password'));
  }
  user.password = new_password;
  const rs = await user.save();
  res.status(201).json(201, { rs });
});

import AsyncMiddleware from '../middleware/AsyncMiddleware';
import ErrorResponse from '../model/response/ErrorResponse';
import SuccessResponse from '../model/response/SuccessResponse';
import User from '../model/User';

export const Register = AsyncMiddleware(async (req, res, next) => {
  const { name, password, email } = req.body;
  const check_user = await User.findOne({ email });
  if (check_user) {
    return next(new ErrorResponse(400, 'Email is already existed'));
  }
  const user = new User({ name, password, email });
  const rs = await user.save();
  return res.status(200).json(new SuccessResponse(200, { rs }));
});

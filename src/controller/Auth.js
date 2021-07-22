import AsyncMiddleware from '../middleware/AsyncMiddleware';
import ErrorResponse from '../model/response/ErrorResponse';
import SuccessResponse from '../model/response/SuccessResponse';
import User from '../model/User';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
export const Register = AsyncMiddleware(async (req, res, next) => {
  const { name, password, email, gender } = req.body;
  const check_user = await User.findOne({ email });

  if (check_user) {
    return next(new ErrorResponse(400, 'Email is already existed'));
  }

  const user = new User({ name, password, email, gender });
  const rs = await user.save();
  return res.status(200).json(new SuccessResponse(200, { rs }));
});

export const Login = AsyncMiddleware(async (req, res, next) => {
  const { email, password } = req.body;
  const check_user = await User.findOne({ email });
  if (!check_user) {
    return next(new ErrorResponse(400, 'User does not exist'));
  }
  const { _id, name } = check_user;

  const comparePassword = await bcrypt.compare(password, check_user.password);
  if (!comparePassword) {
    return next(new ErrorResponse(400, 'Wrong password'));
  }
  const token = jwt.sign({ _id, name, email }, process.env.JWT_SECRET, {
    expiresIn: '24h',
  });
  res.status(200).json(new SuccessResponse(200, { _id, name, email, token }));
});

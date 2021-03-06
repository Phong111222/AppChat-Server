import jwt from 'jsonwebtoken';
import ErrorResponse from '../model/response/ErrorResponse';
import User from '../model/User';

export default async (req, _, next) => {
  const token = req.headers.authorization
    ? req.headers.authorization.split(' ')[1]
    : null;

  if (!token) {
    return next(new ErrorResponse(401, 'JWT is required'));
  }
  jwt.verify(token, process.env.JWT_SECRET, function(err, decode) {
    if (err) {
      return next(new ErrorResponse(401, 'Token expired'));
    }
  });

  const decodedData = jwt.decode(token, process.env.JWT_TOKEN);
  console.log(decodedData);
  if (!decodedData?._id) {
    return next(new ErrorResponse(500, 'crash server'));
  }
  const check_user = await User.findOne({ _id: decodedData?._id }).populate({
    path: 'friendRequests',
    select: '-password -friendRequests',
  });
  if (!check_user) {
    return next(new ErrorResponse(400, 'User does not exist'));
  }
  req.user = check_user;
  next();
};

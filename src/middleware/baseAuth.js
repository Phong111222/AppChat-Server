import ErrorResponse from '../model/response/ErrorResponse';
export default (req, _, next) => {
  const token = req.headers.authorization
    ? req.headers.authorization.split(' ')[1]
    : null;

  if (!token) {
    return next(new ErrorResponse(401, 'Base token is required'));
  }
  // if base token exist
  const decode = new Buffer.from(token, 'base64').toString();

  if (`${process.env.baseUser}:${process.env.basePassword}` === decode) {
    next();
  } else return next(new ErrorResponse(404, 'Invalid base token'));
};

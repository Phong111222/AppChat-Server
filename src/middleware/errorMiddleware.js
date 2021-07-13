import ErrorResponse from '../model/response/ErrorResponse';

export default (error, req, res, next) => {
  console.log({ error });
  res.json(new ErrorResponse(400, { error }));
};

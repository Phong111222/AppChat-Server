import ErrorResponse from '../model/response/ErrorResponse';

export default (error, _, res, next) => {
  let errors = { ...error };

  // mongo validator
  if (error.name === 'ValidationError') {
    errors = new ErrorResponse(400, error.errors);
    for (let i in errors.message) {
      errors.message[i] = errors.message[i].message;

      if (i === 'gender') {
        errors.message[
          i
        ] = `${errors.message[i]} Gender must be male or female`;
      }
    }
  }
  res.status(400).json(new ErrorResponse(error.StatusCode, errors));
  next();
};

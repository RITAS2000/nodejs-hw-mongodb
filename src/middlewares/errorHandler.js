import { isHttpError } from 'http-errors';

export function errorHandler(error, req, res, next) {
  if (isHttpError(error) === true) {
    return res
      .status(error.statusCode)
      .json({ status: error.statusCode, message: error.message });
  }
  if (error.name === 'ValidationError') {
    return res.status(400).json({
      status: 400,
      message: 'Validation error',
      data: error.message,
    });
  }
  console.error(error);

  res.status(500).json({
    status: 500,
    message: 'Something went wrong',
    data: error.message,
  });
}

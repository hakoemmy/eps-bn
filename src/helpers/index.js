// eslint-disable-next-line import/prefer-default-export
export const sendResult = (res, status, message, data) =>
  res.status(status).json({
    status,
    message,
    data,
  });

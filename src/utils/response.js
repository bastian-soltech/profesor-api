export const successResponse = (res, data, message = 'Success', status = 200) => {
  res.status(status).json({
    status,
    message,
    data,
  });
};

export const errorResponse = (res, message = 'Internal Server Error', status = 500) => {
  res.status(status).json({
    status,
    message,
  });
};

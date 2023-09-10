import { statusCodes } from '../constants';
import async from './errorHandler';

export default (schema) =>
  async((req, res, next) => {
    const { body, query, params } = req;
    const { error } = schema.validate({ ...body, ...query, ...params });
    if (error) {
      const {
        details: [detail = null],
      } = error;
      console.log(error);
      let { message } = detail;
      const { path } = detail;
      if (path.includes('fullName'))
        message =
          'fullName should contain the first and lastname and they should be alphanumeric';
      return res.status(statusCodes.BAD_REQUEST).send({
        status: statusCodes.BAD_REQUEST,
        message: 'Input validation failed!',
        error: message,
      });
    }
    return next();
  });

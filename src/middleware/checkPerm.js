import { statusCodes } from '../constants';
import { sendResult } from '../helpers';

export default (roles = []) => ({ user: { role = '' } }, res, next) => {
  if (roles.includes(role.toUpperCase())) return next();
  return sendResult(
    res,
    statusCodes.FORBIDDEN,
    'Not allowed to access this resource'
  );
};

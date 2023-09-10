import { Op } from 'sequelize';
import { errorMessages, statusCodes } from '../constants';
import { sendResult } from '../helpers';

export default async (req, res, next) => {
    const { user: { role }, body: { roleId } } = req;
    if (role === 'COMPANY_ADMIN' && (parseInt(roleId) ===  1 || parseInt(roleId) === 2 || parseInt(roleId) === 6 ) ) {
        return sendResult(
            res,
            statusCodes.FORBIDDEN,
            errorMessages.YOU_ARE_NOT_ALLOWED_TO_CREATE_THIS_USER
          );
    }
    if ((role === 'ADMIN' || role === 'SUPER_ADMIN') && (parseInt(roleId) !== 6 && parseInt(roleId) !== 2)) {
      return sendResult(
          res,
          statusCodes.FORBIDDEN,
          errorMessages.YOU_ALLOWED_TO_CREATE_COMPANY_ADMIN_AND_ADMINS
        );
    }
    next();
  };

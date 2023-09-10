import { Op } from 'sequelize';
import { errorMessages, statusCodes } from '../constants';
import { sendResult } from '../helpers';
import models from '../models';

const { User } = models;

export default async (req, res, next) => {
    const { body: { email = '', telephone = ''}, params: { userId = '' } } = req;
    let where = { [Op.or]: [{ email: email.toLowerCase() } , { telephone }] };
    if(userId.length!== 0){
      where.id = { [Op.not]: userId };
    }
    const userRecord = await User.findAll({ where});
    if (userRecord.length) {
        return sendResult(
            res,
            statusCodes.CONFLICT,
            errorMessages.PHONE_OR_EMAIL_ALREADY_TAKEN
          );
    }
    if(email.length){
        req.body = {...req.body, email: email.toLowerCase()};
      }
    next();
  };
  
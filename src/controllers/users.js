import bcrypt from 'bcryptjs';
import { errorMessages, statusCodes, JWT_KEY, FRONTEND_URL } from '../constants';
import { sendResult } from '../helpers';
import models from '../models';

const { User, Role } = models;

export default class UserController {
  static async login(req, res) {
    const { email } = req.body;
    const user = await User.findOne({
      where: { email },
      include: [{ model: Role, as: 'role', attributes: ['name', 'id'] }],
    });
    if (user) {
      const comparePassword = await bcrypt.compare(req.body.password, user.password);
      if (comparePassword) {
        if (user.isVerified) {
          const { password, resetKey, ...data } = user.get();
          const token = await user.generateToken(data);
          return res.set('accessToken', token).status(statusCodes.OK).json({
            data,
            message: 'Logged in successfully',
          });
        }
        return sendResult(res, statusCodes.UNAUTHORIZED, errorMessages.VERIFY_EMAIL);
      }
      return sendResult(
        res,
        statusCodes.BAD_REQUEST,
        errorMessages.WRONG_EMAIL_OR_PASSWORD
      );
    }
    return sendResult(
      res,
      statusCodes.BAD_REQUEST,
      errorMessages.WRONG_EMAIL_OR_PASSWORD
    );
  }

  static async create({ body }, res) {

    const user = await User.create({
      ...body,
      roleId: 4,
      isVerified: true
    }
    );

    const { password, resetKey, ...data } = user.get();
    const token = await user.generateToken(data);
    return res.set('accessToken', token).status(statusCodes.OK).json({
      data,
      message: 'Vendor registered Successful',
    });

  }

  static async getProfile({ user }, res) {

    const profile = await User.findOne({
      where: { id: user.id },
      attributes: { exclude: ['resetKey', "password"] }
    });

    if (!profile)
      return sendResult(
        res,
        statusCodes.NOT_FOUND,
        'User profile not found'
      );
    const { password, roleId, ...data } = profile.get();
    return sendResult(res, statusCodes.OK, 'Profile retrieved successfully', {
      ...data,
      role: { name: user.role, id: roleId },
    });
  }
}

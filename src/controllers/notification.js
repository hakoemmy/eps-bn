import { errorMessages, statusCodes } from '../constants';
import paginate from '../helpers/paginate';
import { sendResult } from '../helpers';
import models from '../models';

const { Notification } = models;

export default class NotificationController {

    static async getAll({ query: { limit = 10, page = 1 }, user: { role, id } }, res) {

        const pagination = paginate(page, limit);

        let notifications = await Notification.findAndCountAll({
            where: { userId: id },
            limit: pagination.limit,
            offset: pagination.offset,
            order: [
                ['createdAt', 'ASC']
            ],
        });

        page = Number(page);
        notifications = { ...notifications, page };

        return sendResult(
            res,
            statusCodes.OK,
            'Notification(s) retrieved',
            notifications
        );

    }
}
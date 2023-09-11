import { errorMessages, statusCodes } from '../constants';
import paginate from '../helpers/paginate';
import { sendResult } from '../helpers';
import models from '../models';

const { Rating, User } = models;


export default class RatingController {

    static async create({ body, user: { role, id } }, res) {

        const checkExistingVendor = await User.findAll({
            where: {
                id: body.vendorId
            }
        });

        if (checkExistingVendor[0]?.dataValues.roleId !== 4)
            return sendResult(
                res,
                statusCodes.FORBIDDEN,
                'You can not rate Non vendor user.'
            );

        const checkExistingRating = await Rating.findAll({
            where: {
                vendorId: body.vendorId, bidId: body.bidId
            }
        });
        if (checkExistingRating.length) {
            return sendResult(
                res,
                statusCodes.FORBIDDEN,
                'You already rated this vendor for the same bid.'
            );
        }

        const createdRating = await Rating.create(
            {
                ...body
            });
        // increment user score
        await User.update({ score: checkExistingVendor[0]?.dataValues.score + body.score },
            {
                where: { id: body.vendorId },
                returning: true, plain: true
            });

        return sendResult(
            res,
            statusCodes.CREATED,
            'Rating created',
            createdRating
        );

    }
}
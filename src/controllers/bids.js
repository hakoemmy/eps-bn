import { errorMessages, statusCodes } from '../constants';
import paginate from '../helpers/paginate';
import { sendResult } from '../helpers';
import models from '../models';

const { Bid, Tender, User } = models;

export default class BidController {

    static async create({ body, user: { role, id } }, res) {

        const checkExistingTender = await Tender.findAll({
            where: {
                id: body.tenderId
            }
        });
        console.log(checkExistingTender[0]?.dataValues);
        if (checkExistingTender[0]?.dataValues.status !== 'Published')
            return sendResult(
                res,
                statusCodes.FORBIDDEN,
                'You can not bid to un published tender.'
            );

        const checkExistingBid = await Bid.findAll({
            where: {
                userId: id
            }
        });
        if (checkExistingBid.length) {
            return sendResult(
                res,
                statusCodes.FORBIDDEN,
                'You already bidded for this tender.'
            );
        }

        const createdBid = await Bid.create({ ...body, userId: id });
        return sendResult(
            res,
            statusCodes.CREATED,
            'Bid created',
            createdBid
        );

    }

    static async getAll({ query: { limit = 10, page = 1 }, user: { role, id } }, res) {
        const where = {};

        const pagination = paginate(page, limit);

        if (role === 'VENDOR') {
            where.userId = id;
        }

        let bids = await Bid.findAndCountAll({
            where: where,
            include: [
                { model: User, as: 'user', attributes: { exclude: ['password', 'deletedAt', 'resetKey'] } },
                { model: Tender, as: 'tender', attributes: { exclude: role === 'VENDOR' ? ['preferredVendorBidScore'] : [] } }
            ],
            limit: pagination.limit,
            offset: pagination.offset,
            order: [
                ['createdAt', 'ASC']
            ],
        });

        page = Number(page);
        bids = { ...bids, page };

        return sendResult(
            res,
            statusCodes.OK,
            'Bid(s) retrieved',
            bids
        );
    }
}
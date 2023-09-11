import { Op } from 'sequelize';
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

        if (checkExistingTender[0]?.dataValues.status !== 'Published')
            return sendResult(
                res,
                statusCodes.FORBIDDEN,
                'You can not bid to un published tender.'
            );

        const checkExistingBid = await Bid.findAll({
            where: {
                userId: id, tenderId: body.tenderId
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
                { model: User, as: 'user', attributes: { exclude: ['password', 'deletedAt', 'resetKey', 'roleId'] } },
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


    static async getSuggestedWinners({ body, params: { tenderId } }, res) {

        const tender = await Tender.findOne({
            where: {
                id: tenderId
            },
            include: [
                { model: Bid, as: 'tender', where: { status: 'Submitted' } }
            ]
        });

        if(!tender){
            return sendResult(
                res,
                statusCodes.OK,
                'Winner Evaluation has been done'
            ); 
        }

        const bidderIds = tender.dataValues.tender.map((bid) => bid.dataValues.userId);
        
        const users = await User.findAll({
            where: {
                id: bidderIds,
                score: { [Op.gte]: tender.dataValues.preferredVendorBidScore }
            },
            attributes: ['id'],
        });

        const foundSuggestedBidders = users.map((user) => user.dataValues.id);

        return sendResult(
            res,
            statusCodes.OK,
            'System Suggested Winners retrieved',
            tender.dataValues.tender.filter((bid) => foundSuggestedBidders.includes(bid.userId))
        );

    }

    static async selectWinner({ body, params: { bidId } }, res) {

        const existingBid = await Bid.findOne({
            where: {
                id: bidId, status: 'Submitted'
            }
        });

        if (!existingBid) {
            return sendResult(
                res,
                statusCodes.FORBIDDEN,
                'Winner has been already selected'
            );
        }

        const updatedWinner = await Bid.update({
            status: 'Won'
        },
            {
                where: { id: bidId },
                returning: true, plain: true
            });

        // TODO: Send a notification to vendor that they have won

        // Update other bidders to Failed
        await Bid.update({
            status: 'Failed'
        },
            {
                where: { tenderId: existingBid.dataValues.tenderId, status: 'Submitted' },
                returning: true, plain: true
            });

        // TODO: Send notifications to other vendors that they have failed

        return sendResult(
            res,
            statusCodes.OK,
            'Winner selected',
            updatedWinner[1]
        );
    }
}
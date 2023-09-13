import { errorMessages, statusCodes } from '../constants';
import paginate from '../helpers/paginate';
import { sendResult } from '../helpers';
import models from '../models';
import { Queue } from 'bullmq';

const { Tender } = models;

const redisOptions = { host: "localhost", port: 6379 };

export default class TenderController {
    static tendersQueue = new Queue('tenders', { connection: redisOptions });

    static async create({ body, user: { role, id } }, res) {

        const tender = await Tender.create({ ...body });

        // Notifying procurement officers about the tender so they can amend
        if (role === 'STAFF_USER') {
            const payload = {
                action: 'tender.created',
                tenderId: tender.dataValues.id,
                creatorId: id
            };

            await TenderController.tendersQueue.add('tender.created', payload);
        }

        return sendResult(
            res,
            statusCodes.CREATED,
            'Tender created',
            tender
        );

    }

    static async getAll({ query: { limit = 10, page = 1 }, user: { role } }, res) {
        const where = {};
        let exclude = [];

        const pagination = paginate(page, limit);

        if (role === 'VENDOR' || role === 'STAFF_USER') {
            where.status = 'Published';
            exclude = ['preferredVendorBidScore'];
        }

        let tenders = await Tender.findAndCountAll({
            where: where,
            attributes: { exclude: exclude },
            limit: pagination.limit,
            offset: pagination.offset,
            order: [
                ['createdAt', 'ASC']
            ],
        });

        page = Number(page);
        tenders = { ...tenders, page };

        return sendResult(
            res,
            statusCodes.OK,
            'Tender(s) retrieved',
            tenders
        );
    }

    static async amendTender({ body, params: { tenderId }, user: { role, id } }, res) {

        const existingTender = await Tender.findAll({
            where: {
                id: tenderId
            }
        });

        if (existingTender[0]?.dataValues?.status !== 'Draft') {
            return sendResult(
                res,
                statusCodes.FORBIDDEN,
                `Tender can not be amended, it\'s already: ${existingTender[0]?.dataValues?.status}`
            );
        }

        const updatedTender = await Tender.update({
            ...body,
            status: 'Amended'
        },
            {
                where: { id: tenderId },
                returning: true, plain: true
            });

        // Notify ADMINs that a tender is amended by OFFICER and it needs approval
        if (role === 'PROCUREMENT_OFFICER') {
            const payload = {
                action: 'tender.amended',
                tenderId,
                creatorId: id
            };

            await TenderController.tendersQueue.add('tender.amended', payload);
        }

        return sendResult(
            res,
            statusCodes.OK,
            'Tender Amended',
            updatedTender[1]
        );

    }

    static async getProcurrementRequests({ query: { limit = 10, page = 1 }, user: { role } }, res) {
        const pagination = paginate(page, limit);

        let tenders = await Tender.findAndCountAll({
            where: {
                status: 'Amended'
            },
            limit: pagination.limit,
            offset: pagination.offset,
            order: [
                ['createdAt', 'ASC']
            ],
        });

        page = Number(page);
        tenders = { ...tenders, page };

        return sendResult(
            res,
            statusCodes.OK,
            'Procurement request(s) retrieved',
            tenders
        );
    }

    static async approveOrRejectTender({ body, params: { tenderId }, user: { role, id } }, res) {

        const existingTender = await Tender.findAll({
            where: {
                id: tenderId
            }
        });

        if (existingTender[0]?.dataValues?.status !== 'Amended') {
            return sendResult(
                res,
                statusCodes.FORBIDDEN,
                `Tender can not be approved or rejected, it\'s already: ${existingTender[0]?.dataValues?.status}`
            );
        }

        const updatedTender = await Tender.update({
            status: body.action === 'Approved' ? 'Published' : 'Rejected'
        },
            {
                where: { id: tenderId },
                returning: true, plain: true
            });

        // Notify OFFICERs that a tender has been approved or rejected
        // Notify Registered Vendors about new tender listings
        const payload = {
            action: 'tender.approved-or-rejected',
            tenderId,
            creatorId: id
        };

        await TenderController.tendersQueue.add('tender.approved-or-rejected', payload);

        return sendResult(
            res,
            statusCodes.OK,
            `Tender is ${body.action}`,
            updatedTender[1]
        );

    }


}
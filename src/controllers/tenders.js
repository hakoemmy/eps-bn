import { errorMessages, statusCodes } from '../constants';
import paginate from '../helpers/paginate';
import { sendResult } from '../helpers';
import models from '../models';

const { Tender } = models;

export default class TenderController {
    static async create({ body }, res) {

        const tender = await Tender.create({ ...body });

        // TODO: Notifying procurement officers about the tender so they can amend and
        // send procurrament request to Admins to reject or approve
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

    static async amendTender({ body, params: { tenderId } }, res) {

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

        // TODO: Notify ADMINs that a tender is amended by OFFICER and it needs approval

        return sendResult(
            res,
            statusCodes.OK,
            'Tender Amended',
            updatedTender[1]
        );

    }

    static async getProcurrementRequests({ query: { limit = 10, page = 1 }, user: { role } }, res) {
        const where = {};
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

    static async approveOrRejectTender({ body, params: { tenderId } }, res) {

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

        // TODO: Notify OFFICERs that a tender has been approved or rejected

        return sendResult(
            res,
            statusCodes.OK,
            `Tender is ${body.action}`,
            updatedTender[1]
        );

    }

}
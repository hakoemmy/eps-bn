import { sendResult } from '../helpers';
import { errorMessages, statusCodes } from '../constants';
import models from '../models';

const { Bid, Tender, User } = models;

export default class ReportController {

    static async getUserStats({ body }, res) {
        const report = {};

        const totalVendors = await User.count({
            where: {
                roleId: 4
            }
        });
        report.totalVendors = totalVendors;

        const totalOfficers = await User.count({
            where: {
                roleId: 2
            }
        });
        report.totalOfficers = totalOfficers;

        const totalStaffUsers = await User.count({
            where: {
                roleId: 3
            }
        });
        report.totalStaffUsers = totalStaffUsers;

        const totalAdmins = await User.count({
            where: {
                roleId: 1
            }
        });
        report.totalAdmins = totalAdmins;

        return sendResult(
            res,
            statusCodes.OK,
            'User Stats Report',
            report
        );
    }

    static async getTenderStats({ body }, res) {
        const report = {};

        const totalOpenedTenders = await Tender.count({
            where: {
                status: 'Draft'
            }
        });
        report.totalOpenedTenders = totalOpenedTenders

        const totalAmendedTenders = await Tender.count({
            where: {
                status: 'Amended'
            }
        });
        report.totalAmendedTenders = totalAmendedTenders

        const totalPublishedTenders = await Tender.count({
            where: {
                status: 'Published'
            }
        });
        report.totalPublishedTenders = totalPublishedTenders

        const totalRejectedTenders = await Tender.count({
            where: {
                status: 'Rejected'
            }
        });
        report.totalRejectedTenders = totalRejectedTenders

        return sendResult(
            res,
            statusCodes.OK,
            'Tender Stats Report',
            report
        );
    }

    static async getBidStats({ body }, res) {
        const report = {};

        const totalSubmittedBids = await Bid.count({
            where: {
                status: 'Submitted'
            }
        });
        report.totalSubmittedBids = totalSubmittedBids

        const totalWonBids = await Bid.count({
            where: {
                status: 'Won'
            }
        });
        report.totalWonBids = totalWonBids

        const totalFailedBids = await Bid.count({
            where: {
                status: 'Failed'
            }
        });
        report.totalFailedBids = totalFailedBids
        

        return sendResult(
            res,
            statusCodes.OK,
            'Bid Stats Report',
            report
        );
    }
}
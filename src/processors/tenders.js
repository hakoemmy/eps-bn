import models from '../models';

const { Tender, Notification, User } = models;

export const processTenderCreated = async (job) => {
    const { tenderId, creatorId } = job.data;

    // Notifying all Procurement officers
    const staffUser = await User.findOne({
        where: {
            id: creatorId
        }
    });

    const tender = await Tender.findOne({
        where: {
            id: tenderId
        }
    });

    const notificationPayload = {
        type: job.data.action,
        tenderId,
        creatorId
    };

    const officers = await User.findAll({
        where: {
            roleId: 2
        }
    });

    for (const officer of officers) {
        const notifcationBody = `Hey ${officer.dataValues.name}, ${staffUser.dataValues.name} opened a new tender called: "${tender.dataValues.name}". Check it out to create a procurement request!`;

        await Notification.create({
            userId: officer.dataValues.id,
            body: notifcationBody,
            payload: notificationPayload
        });
    }

    return;

}


export const processTenderAmended = async (job) => {
    const { tenderId, creatorId } = job.data;

    // Notifying all Procurement admins
    const officerUser = await User.findOne({
        where: {
            id: creatorId
        }
    });

    const tender = await Tender.findOne({
        where: {
            id: tenderId
        }
    });

    const notificationPayload = {
        type: job.data.action,
        tenderId,
        creatorId
    };

    const admins = await User.findAll({
        where: {
            roleId: 1
        }
    });

    for (const admin of admins) {
        const notifcationBody = `Hey ${admin.dataValues.name}, there is a new procurement request from ${officerUser.dataValues.name} about "${tender.dataValues.name}". You can review and approve or reject it.`;

        await Notification.create({
            userId: admin.dataValues.id,
            body: notifcationBody,
            payload: notificationPayload
        });
    }

    return;
};

export const processTenderApprovedOrRjected = async (job) => {
    const { tenderId, creatorId } = job.data;

    // Notifying all Procurement officers
    const adminUser = await User.findOne({
        where: {
            id: creatorId
        }
    });

    const tender = await Tender.findOne({
        where: {
            id: tenderId
        }
    });

    const notificationPayload = {
        type: job.data.action,
        tenderId,
        creatorId
    };

    const officers = await User.findAll({
        where: {
            roleId: 2
        }
    });

    for (const officer of officers) {
        const notifcationBody = `Hey ${officer.dataValues.name}, Your procurement request about "${tender.dataValues.name}" has been ${tender.dataValues.status} by ${adminUser.dataValues.name}`;

        await Notification.create({
            userId: officer.dataValues.id,
            body: notifcationBody,
            payload: notificationPayload
        });
    }

    if (tender.dataValues.status === 'Published') {
        const vendors = await User.findAll({
            where: {
                roleId: 4
            }
        });

        for (const vendor of vendors) {
            const notifcationBody = `Hey ${vendor.dataValues.name}, new tender about "${tender.dataValues.name}" has been published. Check it out!`;

            await Notification.create({
                userId: vendor.dataValues.id,
                body: notifcationBody,
                payload: notificationPayload
            });
        }
    }

    return;

}
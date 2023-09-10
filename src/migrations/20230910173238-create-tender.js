'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('tenders', {
      id: {
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
      },
      name: {
        type: Sequelize.STRING
      },
      status: {
        type: Sequelize.ENUM('Draft','Amended', 'Published', 'Rejected'),
        allowNull: false,
      },
      bidSubmissionDeadline: {
        allowNull: true,
        type: Sequelize.DATE
      },
      preferredVendorBidScore: {
        allowNull: true,
        type: Sequelize.DOUBLE
      },
      tenderDocumentUrl: {
        type: Sequelize.STRING,
        allowNull: false
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('tenders');
  }
};
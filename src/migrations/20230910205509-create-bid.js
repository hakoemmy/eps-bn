'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('bids', {
      id: {
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
      },
      userId: {
        type: Sequelize.UUID,
        references: { model: 'users', key: 'id' },
        allowNull: false,
      },
      tenderId: {
        type: Sequelize.UUID,
        references: { model: 'tenders', key: 'id' },
        allowNull: false,
      },
      statmentOfInterest: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      bidQuotationUrl: {
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
    await queryInterface.dropTable('bids');
  }
};
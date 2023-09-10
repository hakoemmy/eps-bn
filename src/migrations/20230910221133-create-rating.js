'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('ratings', {
      id: {
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
      },
      vendorId: {
        type: Sequelize.UUID,
        references: { model: 'users', key: 'id' },
        allowNull: false,
      },
      bidId: {
        type: Sequelize.UUID,
        references: { model: 'bids', key: 'id' },
        allowNull: false,
      },
      score: {
        type: Sequelize.DOUBLE
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
    await queryInterface.dropTable('ratings');
  }
};
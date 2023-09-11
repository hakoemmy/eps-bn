const { regex } = require('../constants');

module.exports = {
  up: (queryInterface, Sequelize) =>
    queryInterface.createTable('users', {
      id: {
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
      },
      name: {
        type: Sequelize.STRING(100),
        allowNull: true
      },
      vendorTin: {
        type: Sequelize.STRING(100),
        allowNull: true
      },
      vendorProductOfferings: {
        type: Sequelize.ARRAY(Sequelize.STRING),
        allowNull: true
      },
      vendorBio: {
        type: Sequelize.STRING(100),
        allowNull: true
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
          isEmail: true,
          notNull: {
            msg: 'Please provide a valid email address',
          },
          unique: {
            msg: 'Email address already in use!',
          },
        },
        unique: true,
      },
      password: {
        type: Sequelize.TEXT,
        is: regex.password,
        allowNull: true,
      },
      resetKey: {
        type: Sequelize.STRING,
        is: regex.sha256,
        allowNull: true,
      },
      telephone: {
        type: Sequelize.STRING(16),
        is: regex.phone,
        unique: { args: true, msg: 'Telephone number is already in use!' },
        validate: {
          len: [3, 100],
          isAlphanumeric: true,
          notNull: {
            msg: 'Telephone number should be provided',
          },
        },
      },
      roleId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'roles', key: 'id' },
      },
      avatar: {
        type: Sequelize.STRING(255),
        defaultValue: null,
        is: regex.url,
        validate: { isUrl: true },
        allowNull: true
      },
      score: {
        type: Sequelize.DOUBLE,
        defaultValue: 0
      },
      address: { type: Sequelize.TEXT, allowNull: true },
      isVerified: { type: Sequelize.BOOLEAN, defaultValue: false },
      createdAt: { allowNull: false, type: Sequelize.DATE },
      updatedAt: { allowNull: false, type: Sequelize.DATE },
      deletedAt: { type: Sequelize.DATE, default: null }
    }),
  down: (queryInterface) => queryInterface.dropTable('users'),
};

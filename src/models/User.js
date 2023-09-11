import bcrypt from 'bcryptjs';
import { sign } from 'jsonwebtoken';
import { JWT_KEY, regex } from '../constants';

module.exports = (Sequelize, DataTypes) => {
  const User = Sequelize.define(
    'User',
    {
      id: {
        primaryKey: true,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
      },
      name: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      vendorTin: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      vendorProductOfferings: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        allowNull: true,
      },
      vendorBio: {
        type: DataTypes.TEXT(),
        allowNull: true,
      },
      address: { type: DataTypes.TEXT, allowNull: true },
      telephone: {
        type: DataTypes.STRING(16),
        is: regex.phone,
        validate: { len: [3, 100], isAlphanumeric: true },
      },
      avatar: {
        type: DataTypes.STRING(255),
        defaultValue: null,
        is: regex.url,
        validate: { isUrl: true },
      },
      score: {
        type: DataTypes.DOUBLE,
        defaultValue: 0
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          isEmail: true,
          notNull: { msg: 'Please provide a valid email address' },
        },
        unique: { args: true, msg: 'Email address already in use!' },
      },
      password: {
        type: DataTypes.TEXT,
        is: regex.password,
        allowNull: true,
        set(password) {
          return this.setDataValue('password', bcrypt.hashSync(password, 10));
        },
      },
      resetKey: {
        type: DataTypes.STRING,
        is: regex.sha256,
        allowNull: true,
      },
      isVerified: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      roleId: {
        type: DataTypes.INTEGER,
        defaultValue: 5,
        references: { model: 'roles', key: 'id' },
      },
      deletedAt: {
        type: DataTypes.DATE,
        allowNull: true,
      },
    },
    {
      tableName: 'users',
      timestamps: true,
      defaultScope: {
        attributes: { exclude: ['deletedAt', 'updatedAt'] },
        where: { deletedAt: null },
      },
      scopes: {
        reset: {
          attributes: { exclude: ['password', 'updatedAt'] },
          where: { deletedAt: null },
        },
      },
      paranoid: true,
    }
  );
  User.associate = ({ Role, Bid, Rating }) => {
    User.belongsTo(Role, { foreignKey: 'roleId', targetKey: 'id', as: 'role' });
    User.hasMany(Bid, { foreignKey: 'userId', targetKey: 'id', as: 'user' });
    User.hasMany(Rating, { foreignKey: 'vendorId', targetKey: 'id', as: 'vendor' });
  };
  // eslint-disable-next-line func-names
  User.prototype.getRoleName = async function () {
    const { roleId: id } = this;
    const role = await Sequelize.models.Role.findOne({ where: { id } });
    return role.name;
  };

  // eslint-disable-next-line func-names
  User.prototype.generateToken = async function (subscriptions = [], options = { expiresIn: '30d' }) {
    const { roleId, id, name } = this;
    const role = await Sequelize.models.Role.findOne({ where: { id: roleId } });
    return sign({ id, role: role.name, name }, JWT_KEY, options);
  };

  return User;
};

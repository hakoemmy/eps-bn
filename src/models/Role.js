module.exports = (Sequelize, DataTypes) => {
  const Role = Sequelize.define(
    'Role',
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      name: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      deletedAt: {
        type: DataTypes.DATE,
        allowNull: true,
      },
    },
    {
      tableName: 'roles',
      timestamps: true,
    }
  );
  Role.associate = ({ User }) => {
    Role.hasMany(User, { foreignKey: 'roleId', targetKey: 'id', as: 'role' });
  };
  return Role;
};

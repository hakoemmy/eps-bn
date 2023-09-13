module.exports = (Sequelize, DataTypes) => {
  const Notification = Sequelize.define(
    'Notification',
    {
      id: {
        primaryKey: true,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
      },
      userId: {
        type: DataTypes.UUID,
        references: { model: 'users', key: 'id' },
      },
      body: {
        type: DataTypes.TEXT,
        allowNull: false
      },
      payload: {
        type: DataTypes.JSONB,
        allowNull: false
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
      },
    },
    {
      tableName: 'notifications',
      timestamps: true,
    }
  );
  Notification.associate = ({ User }) => {
    Notification.belongsTo(User, { foreignKey: 'userId', targetKey: 'id', as: 'user_notification' });
  };
  return Notification;
};

module.exports = (Sequelize, DataTypes) => {
  const Rating = Sequelize.define(
    'Rating',
    {
      id: {
        primaryKey: true,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
      },
      vendorId: {
        type: DataTypes.UUID,
        references: { model: 'users', key: 'id' },
      },
      bidId: {
        type: DataTypes.UUID,
        references: { model: 'bids', key: 'id' },
      },
      score: {
        type: DataTypes.DOUBLE,
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
      tableName: 'ratings',
      timestamps: true,
    }
  );
  Rating.associate = ({ User, Bid }) => {
    Rating.belongsTo(User, { foreignKey: 'vendorId', targetKey: 'id', as: 'vendor' });
    Rating.belongsTo(Bid, { foreignKey: 'bidId', targetKey: 'id', as: 'bid' });
  };
  return Rating;
};

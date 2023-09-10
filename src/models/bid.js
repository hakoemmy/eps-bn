module.exports = (Sequelize, DataTypes) => {
  const Bid = Sequelize.define(
    'Bid',
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
      tenderId: {
        type: DataTypes.UUID,
        references: { model: 'tenders', key: 'id' },
      },
      statmentOfInterest: {
        type: DataTypes.TEXT,
        allowNull: false
      },
      bidQuotationUrl: {
        type: DataTypes.STRING,
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
      tableName: 'bids',
      timestamps: true,
    }
  );
  Bid.associate = ({ User, Tender }) => {
    Bid.belongsTo(User, { foreignKey: 'userId', targetKey: 'id', as: 'user' });
    Bid.belongsTo(Tender, { foreignKey: 'tenderId', targetKey: 'id', as: 'tender' });
  };
  return Bid;
};

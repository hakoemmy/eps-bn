module.exports = (Sequelize, DataTypes) => {
  const Tender = Sequelize.define(
    'Tender',
    {
      id: {
        primaryKey: true,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
      },
      name: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      status: {
        type: DataTypes.ENUM,
        values: ['Draft', 'Amended', 'Published', 'Rejected'],
        defaultValue: 'Draft'
      },
      bidSubmissionDeadline: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      preferredVendorBidScore: {
        allowNull: true,
        type: DataTypes.DOUBLE
      },
      tenderDocumentUrl: {
        allowNull: false,
        type: DataTypes.STRING,
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
      tableName: 'tenders',
      timestamps: true,
    }
  );
  Tender.associate = ({ Bid }) => {
    Tender.hasMany(Bid, { foreignKey: 'tenderId', targetKey: 'id', as: 'tender' });
  };
  return Tender;
};
export default (sequelize, DataTypes) => {
  const Document = sequelize.define('Document', {
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    content: {
      type: DataTypes.TEXT,
    },
    ownerId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    accessId: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    classMethods: {
      associate(models) {
        // associations can be defined here
        Document.belongsToMany(models.User, {
          through: 'DocumentUser',
          foreignKey: 'documentId',
        });
        Document.belongsToMany(models.Role, {
          through: 'DocumentRole',
          foreignKey: 'documentId'
        });
        Document.belongsTo(models.User, {
          foreignKey: 'ownerId',
        });
        Document.belongsTo(models.Access, {
          foreignKey: 'accessId',
        });
      }
    }
  });
  return Document;
};

export default (sequelize, DataTypes) => {
  const document = sequelize.define('Document', {
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
      /**
       * @function associate
       *
       * @param {Object} models - Sequelize Models
       * @returns {void}
       */
      associate(models) {
        // associations can be defined here
        document.belongsToMany(models.User, {
          through: 'DocumentUser',
          foreignKey: 'documentId',
        });
        document.belongsToMany(models.Role, {
          through: 'DocumentRole',
          foreignKey: 'documentId'
        });
        document.belongsTo(models.User, {
          foreignKey: 'ownerId',
          onDelete: 'CASCADE'
        });
        document.belongsTo(models.Access, {
          foreignKey: 'accessId',
        });
      }
    }
  });
  return document;
};

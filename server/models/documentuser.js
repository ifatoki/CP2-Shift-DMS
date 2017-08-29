export default (sequelize, DataTypes) => {
  const documentUser = sequelize.define('DocumentUser', {
    rightId: DataTypes.INTEGER
  }, {
    classMethods: {
      /**
       * @function associate
       *
       * @param {Object} models - Sequelize Models
       * @returns {void}
       */
      associate: (models) => {
        documentUser.belongsTo(models.Right, {
          foreignKey: 'rightId'
        });
      }
    }
  });
  return documentUser;
};

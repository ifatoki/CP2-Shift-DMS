export default (sequelize, DataTypes) => {
  const DocumentUser = sequelize.define('DocumentUser', {
    rightId: DataTypes.INTEGER
  }, {
    classMethods: {
      /**
       * @function associate
       *
       * @param {any} models
       * @returns {void}
       */
      associate: (models) => {
        DocumentUser.belongsTo(models.Right, {
          foreignKey: 'rightId'
        });
      }
    }
  });
  return DocumentUser;
};

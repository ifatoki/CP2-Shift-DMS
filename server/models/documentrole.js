export default (sequelize, DataTypes) => {
  const DocumentRole = sequelize.define('DocumentRole', {
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
        // associations can be defined here
        DocumentRole.belongsTo(models.Right, {
          foreignKey: 'rightId'
        });
      }
    }
  });
  return DocumentRole;
};

export default (sequelize, DataTypes) => {
  const DocumentRole = sequelize.define('DocumentRole', {
    rightId: DataTypes.INTEGER
  }, {
    classMethods: {
      /**
       * @function associate
       *
       * @param {Object} models - Sequelize Models
       *
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

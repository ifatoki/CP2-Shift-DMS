export default (sequelize, DataTypes) => {
  const documentRole = sequelize.define('DocumentRole', {
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
        // associations can be defined here
        documentRole.belongsTo(models.Right, {
          foreignKey: 'rightId'
        });
      }
    }
  });
  return documentRole;
};

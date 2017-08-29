export default (sequelize, DataTypes) => {
  const right = sequelize.define('Right', {
    title: DataTypes.STRING,
    description: DataTypes.STRING
  }, {
    classMethods: {
      /**
       * @function associate
       *
       * @param {Object} models - Sequelize Models
       * @returns {void}
       */
      associate(models) {
        right.hasMany(models.DocumentUser, {
          foreignKey: 'rightId'
        });
        right.hasMany(models.DocumentRole, {
          foreignKey: 'rightId'
        });
      }
    }
  });
  return right;
};

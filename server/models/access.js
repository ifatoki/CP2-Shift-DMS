export default (sequelize, DataTypes) => {
  const access = sequelize.define('Access', {
    title: {
      type: DataTypes.STRING,
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
      associate: (models) => {
        // associations can be defined here
        access.hasMany(models.Document, {
          foreignKey: 'accessId',
        });
      }
    }
  });
  return access;
};

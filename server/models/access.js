export default (sequelize, DataTypes) => {
  const Access = sequelize.define('Access', {
    title: {
      type: DataTypes.STRING,
      allowNull: false
    }
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
        Access.hasMany(models.Document, {
          foreignKey: 'accessId',
        });
      }
    }
  });
  return Access;
};

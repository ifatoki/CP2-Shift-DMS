export default (sequelize, DataTypes) => {
  const role = sequelize.define('Role', {
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
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
        // associations can be defined here
        role.hasMany(models.User, {
          foreignKey: 'roleId',
        });

        role.belongsToMany(models.Document, {
          through: 'DocumentRole',
          foreignKey: 'roleId'
        });
      }
    }
  });
  return role;
};

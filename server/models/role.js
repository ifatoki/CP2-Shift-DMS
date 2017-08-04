export default (sequelize, DataTypes) => {
  const Role = sequelize.define('Role', {
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: DataTypes.STRING
  }, {
    classMethods: {
      associate(models) {
        // associations can be defined here
        Role.hasMany(models.User, {
          foreignKey: 'roleId',
        });

        Role.belongsToMany(models.Document, {
          through: 'DocumentRole',
          foreignKey: 'roleId'
        });
      }
    }
  });
  return Role;
};

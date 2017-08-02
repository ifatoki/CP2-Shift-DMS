export default (sequelize, DataTypes) => {
  const Right = sequelize.define('Right', {
    title: DataTypes.STRING,
    description: DataTypes.STRING
  }, {
    classMethods: {
      associate(models) {
        Right.hasMany(models.DocumentUser, {
          foreignKey: 'rightId'
        });
        Right.hasMany(models.DocumentRole, {
          foreignKey: 'rightId'
        });
      }
    }
  });
  return Right;
};

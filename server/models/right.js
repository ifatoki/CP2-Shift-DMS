export default (sequelize, DataTypes) => {
  const Right = sequelize.define('Right', {
    title: DataTypes.STRING,
    description: DataTypes.STRING
  }, {
    classMethods: {
      associate(models) {
        Right.hasMany(models.DocumentUser, {
          foreignKey: 'RightId'
        });
        Right.hasMany(models.DocumentRole, {
          foreignKey: 'RightId'
        });
      }
    }
  });
  return Right;
};

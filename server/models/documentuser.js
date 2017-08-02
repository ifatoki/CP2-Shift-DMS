export default (sequelize, DataTypes) => {
  const DocumentUser = sequelize.define('DocumentUser', {
    rightId: DataTypes.INTEGER
  }, {
    classMethods: {
      associate: (models) => {
        // associations can be defined here
        DocumentUser.belongsTo(models.Right, {
          foreignKey: 'rightId'
        });
      }
    }
  });
  return DocumentUser;
};

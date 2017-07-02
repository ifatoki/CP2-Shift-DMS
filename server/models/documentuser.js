export default (sequelize, DataTypes) => {
  const DocumentUser = sequelize.define('DocumentUser', {
    RightId: DataTypes.INTEGER
  }, {
    classMethods: {
      associate: (models) => {
        // associations can be defined here
        DocumentUser.belongsTo(models.Right, {
          foreignKey: 'RightId'
        });
      }
    }
  });
  return DocumentUser;
};

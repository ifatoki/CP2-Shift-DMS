export default (sequelize, DataTypes) => {
  const DocumentRole = sequelize.define('DocumentRole', {
    RightId: DataTypes.INTEGER
  }, {
    classMethods: {
      associate: (models) => {
        // associations can be defined here
        DocumentRole.belongsTo(models.Right, {
          foreignKey: 'RightId'
        });
      }
    }
  });
  return DocumentRole;
};

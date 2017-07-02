export default (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    email_address: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    first_name: DataTypes.STRING,
    last_name: DataTypes.STRING,
    password: DataTypes.STRING,
    RoleId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    }
  }, {
    classMethods: {
      associate(models) {
        User.belongsTo(models.Role, {
          foreignKey: 'RoleId',
        });

        User.hasMany(models.Document, {
          foreignKey: 'OwnerId',
          as: 'userDocuments'
        });

        User.belongsToMany(models.Document, {
          through: 'DocumentUser',
          foreignKey: 'userId',
        });
      }
    }
  });
  return User;
};

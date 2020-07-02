export default (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    firstname: DataTypes.STRING,
    lastname: DataTypes.STRING,
    password: DataTypes.STRING,
    roleId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    }
  }, {
    classMethods: {
      /**
       * @function associate
       *
       * @param {Object} models - Sequelize Models
       *
       * @returns {void}
       */
      associate(models) {
        User.belongsTo(models.Role, {
          foreignKey: 'roleId',
        });

        User.hasMany(models.Document, {
          foreignKey: 'ownerId',
          as: 'myDocuments'
        });

        User.belongsToMany(models.Document, {
          through: 'DocumentUser',
          foreignKey: 'userId'
        });
      }
    }
  });
  return User;
};

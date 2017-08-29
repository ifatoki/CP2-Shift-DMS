export default (sequelize, DataTypes) => {
  const user = sequelize.define('User', {
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
       * @returns {void}
       */
      associate(models) {
        user.belongsTo(models.Role, {
          foreignKey: 'roleId',
        });

        user.hasMany(models.Document, {
          foreignKey: 'ownerId',
          as: 'myDocuments'
        });

        user.belongsToMany(models.Document, {
          through: 'DocumentUser',
          foreignKey: 'userId'
        });
      }
    }
  });
  return user;
};

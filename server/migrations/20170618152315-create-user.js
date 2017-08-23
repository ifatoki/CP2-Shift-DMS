module.exports = {
  /**
   * @function up
   *
   * @param {any} queryInterface
   * @param {any} Sequelize
   * @returns {void}
   */
  up: (queryInterface, Sequelize) =>
    queryInterface.createTable('Users', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      username: {
        type: Sequelize.STRING,
        unique: true
      },
      email: {
        type: Sequelize.STRING,
        unique: true
      },
      firstname: {
        type: Sequelize.STRING
      },
      lastname: {
        type: Sequelize.STRING
      },
      password: {
        type: Sequelize.STRING
      },
      roleId: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
    }),

  /**
   * @function down
   *
   * @param {any} queryInterface
   * @returns {void}
   */
  down: queryInterface =>
    queryInterface.dropTable('Users')
};

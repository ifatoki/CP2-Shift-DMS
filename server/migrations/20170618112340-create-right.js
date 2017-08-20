module.exports = {
  /**
   * @function up
   *
   * @param {any} queryInterface
   * @param {any} Sequelize
   * @returns {void}
   */
  up: (queryInterface, Sequelize) =>
    queryInterface.createTable('Rights', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      title: {
        type: Sequelize.STRING
      },
      description: {
        type: Sequelize.STRING
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    }),

  /**
   * @function down
   *
   * @param {any} queryInterface
   * @returns {void}
   */
  down: queryInterface =>
    queryInterface.dropTable('Rights')
};

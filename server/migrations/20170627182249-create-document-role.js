module.exports = {
  /**
   * @function up
   *
   * @param {any} queryInterface
   * @param {any} Sequelize
   * @returns {void}
   */
  up: (queryInterface, Sequelize) => {
    queryInterface.createTable('DocumentRoles', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      rightId: {
        type: Sequelize.INTEGER
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },

  /**
   * @function down
   *
   * @param {any} queryInterface
   * @returns {void}
   */
  down: queryInterface =>
    queryInterface.dropTable('DocumentRoles')
};

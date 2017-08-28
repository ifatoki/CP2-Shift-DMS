module.exports = {
  /**
   * @function up
   *
   * @param {any} queryInterface
   * @param {any} Sequelize
   * @returns {void}
   */
  up: (queryInterface, Sequelize) => {
    queryInterface.createTable('Documents', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      title: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      content: {
        type: Sequelize.STRING,
      },
      ownerId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        onDelete: 'cascade'
      },
      accessId: {
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
    queryInterface.dropTable('Documents')
};

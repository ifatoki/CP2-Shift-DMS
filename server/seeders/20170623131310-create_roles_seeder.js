module.exports = {
  up(queryInterface) {
    return queryInterface.bulkInsert('Roles', [
      {
        id: 1,
        title: 'admin',
        description: 'long story',
        createdAt: new Date(),
        updatedAt: new Date()
      }, {
        id: 2,
        title: 'editor',
        description: 'long story',
        createdAt: new Date(),
        updatedAt: new Date()
      }, {
        id: 3,
        title: 'reader',
        description: 'long story',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);
  },

  down(queryInterface) {
    return queryInterface.bulkDelete('Roles', {
      title: ['admin', 'editor', 'reader']
    });
  }
};

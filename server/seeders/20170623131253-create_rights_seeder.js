module.exports = {
  up(queryInterface) {
    return queryInterface.bulkInsert('Rights', [
      {
        id: 1,
        title: 'delete',
        description: 'long story',
        createdAt: new Date(),
        updatedAt: new Date()
      }, {
        id: 2,
        title: 'edit',
        description: 'long story',
        createdAt: new Date(),
        updatedAt: new Date()
      }, {
        id: 3,
        title: 'read',
        description: 'long story',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);
  },

  down(queryInterface) {
    return queryInterface.bulkDelete('Rights', {
      title: ['delete', 'edit', 'read']
    });
  }
};

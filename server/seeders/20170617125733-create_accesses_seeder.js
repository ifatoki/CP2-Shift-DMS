module.exports = {
  up(queryInterface) {
    return queryInterface.bulkInsert(
      'Accesses', [
        {
          id: 1,
          title: 'private',
          createdAt: new Date(),
          updatedAt: new Date()
        }, {
          id: 2,
          title: 'public',
          createdAt: new Date(),
          updatedAt: new Date()
        }, {
          id: 3,
          title: 'shared',
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ]
    );
  },

  down(queryInterface) {
    return queryInterface.bulkDelete(
      'Accesses', {
        title: ['private', 'public', 'shared']
      }
    );
  }
};

module.exports = {
  up(queryInterface) {
    return queryInterface.bulkInsert(
      'Accesses', [
        {
          id: 1,
          title: 'private'
        }, {
          id: 2,
          title: 'public'
        }, {
          id: 3,
          title: 'shared'
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

module.exports = {
  up(queryInterface) {
    return queryInterface.bulkInsert('Documents', [
      {
        id: 1,
        title: 'The best book I never wrote',
        content: 'My first book ever!!!',
        ownerId: 2,
        accessId: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      }, {
        id: 2,
        title: 'The travails of a Nigerian child',
        content: 'Simply stunning and astounding',
        ownerId: 2,
        accessId: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      }, {
        id: 3,
        title: 'The President that would never be',
        content: 'Summary of the events of June 12 1994',
        ownerId: 3,
        accessId: 2,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);
  },

  down(queryInterface) {
    return queryInterface.bulkDelete('Documents', {
      id: [1, 2, 3]
    });
  }
};

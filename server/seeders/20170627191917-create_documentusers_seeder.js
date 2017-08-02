module.exports = {
  up(queryInterface) {
    return queryInterface.bulkInsert('DocumentUsers', [
      {
        rightId: 1,
        userId: 1,
        documentId: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      }, {
        rightId: 2,
        userId: 2,
        documentId: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      }, {
        rightId: 3,
        userId: 1,
        documentId: 2,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);
  },

  down(queryInterface) {
    return queryInterface.bulkDelete('DocumentUsers');
  }
};

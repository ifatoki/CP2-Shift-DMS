module.exports = {
  up(queryInterface) {
    return queryInterface.bulkInsert('DocumentRoles', [
      {
        RightId: 1,
        roleId: 1,
        documentId: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      }, {
        RightId: 2,
        roleId: 2,
        documentId: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      }, {
        RightId: 3,
        roleId: 1,
        documentId: 2,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);
  },

  down(queryInterface) {
    return queryInterface.bulkDelete('DocumentRoles');
  }
};

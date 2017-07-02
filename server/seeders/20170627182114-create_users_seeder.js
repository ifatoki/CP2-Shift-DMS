module.exports = {
  up(queryInterface) {
    return queryInterface.bulkInsert('Users', [
      {
        id: 1,
        username: 'itunuworks',
        email_address: 'itunuworks@gmail.com',
        first_name: 'Itunuloluwa',
        last_name: 'Fatoki',
        // itunuworks
        password:
          '$2a$10$YsGkNkljZow9TsAPDW2cReqfqam4dOUobUOZfx3.9G.zo6xK43op6',
        RoleId: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      }, {
        id: 2,
        username: 'prof_turb',
        email_address: 'prof_turb@gmail.com',
        first_name: 'Turbulence',
        last_name: 'Maestro',
        // prof_turb
        password:
          '$2a$10$WITZwfhfE/nSVZtpbHoYCu4VN9s7EoLiev63p25.PDKkTuIUI.bN6',
        RoleId: 2,
        createdAt: new Date(),
        updatedAt: new Date()
      }, {
        id: 3,
        username: 'swizz_bundle',
        email_address: 'swizz_bundle@yahoo.com',
        first_name: 'Susan',
        last_name: 'Micheal',
        // swizz_bundle
        password:
          '$2a$10$gxXCQVlWzoH1E.7nHa0eWuKR7JhEA.c5ya5PRYeD56hwqHew.CuJO',
        RoleId: 2,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);
  },

  down(queryInterface) {
    return queryInterface.bulkDelete('Users', {
      id: [1, 2, 3]
    });
  }
};

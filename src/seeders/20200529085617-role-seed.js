module.exports = {
  up: async (queryInterface) => {
    await queryInterface.bulkInsert(
      'roles',
      [
        {
          name: 'ADMIN',
          id: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: 'PROCUREMENT_OFFICER',
          id: 2,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: 'STAFF_USER',
          id: 3,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: 'VENDOR',
          id: 4,
          createdAt: new Date(),
          updatedAt: new Date(),
        }
      ],
      {}
    );
  },

  down: async (queryInterface) => {
    await queryInterface.bulkDelete('roles', null, {});
  },
};

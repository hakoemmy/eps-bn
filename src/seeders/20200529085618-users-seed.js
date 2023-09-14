const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');

export default {
  up: (queryInterface) =>
    queryInterface.bulkInsert(
      'users',
      [
        // ADMIN
        {
          name: 'Admin',
          email: 'admin@eps.com',
          password: bcrypt.hashSync('admin', 10),
          createdAt: new Date(),
          updatedAt: new Date(),
          id: uuidv4(),
          isVerified: true,
          roleId: 1
        },
        // PROCUREMENT_OFFICER
        {
          name: 'Officer',
          email: 'officer@eps.com',
          password: bcrypt.hashSync('officer', 10),
          createdAt: new Date(),
          updatedAt: new Date(),
          id: uuidv4(),
          isVerified: true,
          roleId: 2
        },
        // PROCUREMENT_OFFICER
        {
          name: 'Staff User',
          email: 'staff@eps.com',
          password: bcrypt.hashSync('staff', 10),
          createdAt: new Date(),
          updatedAt: new Date(),
          id: uuidv4(),
          isVerified: true,
          roleId: 3
        },
        // PROCUREMENT_OFFICER
        {
          name: 'Vendor',
          email: 'vendor@eps.com',
          vendorTin: '1236467',
          vendorProductOfferings: ['IT Equipments', 'Cars', 'Food', 'Furniture'],
          vendorBio: 'We have been in procurement industry for the past 17 years',
          password: bcrypt.hashSync('vendor', 10),
          createdAt: new Date(),
          updatedAt: new Date(),
          id: uuidv4(),
          isVerified: true,
          roleId: 4,
          score: 15
        },
      ],
      {}
    ),

  down: (queryInterface) => queryInterface.bulkDelete('users', null, {}),
};

/* eslint-disable no-console */
import { PORT } from '../constants';
import models from '../models';

class Database {
  static async connect() {
    const { sequelize } = models;
    try {
      await sequelize.authenticate();
      console.log(`DB successfully connected\nServer listening on port ${PORT}!`);
    } catch (error) {
      console.error('There was an error connecting to the database:', error);
      process.exit(1);
    }
  }
}

export default Database;

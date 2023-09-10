import { DB_DEV, DB_HOST, DB_PORT, DB_SECRET, DB_TEST, DB_USER } from '../constants';

const commonConfig = {
  username: DB_USER,
  password: DB_SECRET,
  host: DB_HOST,
  port: DB_PORT,
  dialect: 'postgres',
  logging: false,
  native: true,
  ssl: true
};

module.exports = {
  development: {
    ...commonConfig,
    database: DB_DEV,
  },
  test: {
    ...commonConfig,
    database: DB_TEST,
    use_env_variable: 'DATABASE_URL',
  },
  staging: {
    ...commonConfig,
    use_env_variable: 'DB_URL',
    logging: true,
  },
  production: {
    ...commonConfig,
    use_env_variable: 'DATABASE_URL',
  },
};

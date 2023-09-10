import dotenv from 'dotenv';
import httpCodes from 'http-status-codes';


dotenv.config();

export const { PORT = 3000, JWT_KEY, DB_URL, DB_HOST } = process.env;
export const { DB_PORT, DB_USER, DB_SECRET, DB_DEV, DB_TEST } = process.env;
export const { NODE_ENV = 'development' } = process.env;

export const statusCodes = httpCodes;

export const regex = {
  password: /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})/,
  email: /^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/i,
  url: /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-/]))?/,
  phone: /^\s*(?:\+?(\d{1,3}))?[-. (]*(\d{3})[-. )]*(\d{3})[-. ]*(\d{4})(?: *x(\d+))?\s*$/,
  fullName: /^[a-zA-Z\-']{2,}(?: [a-zA-Z\-']+){1,2}$/,
  sha256: /\b[A-Fa-f0-9]{64}\b/,
  southAfricaId: /^\d{2}[0-1][0-9][0-3]\d\d{4}[0-1]\d{2}$/
};

export const errorMessages = {
  NOT_FOUND: "The resource you're looking for is not found",
  UNAUTHORIZED: 'Invalid credentials provided',
  ACCESS_DENIAL: "You don't have permission to access this service",
  SERVER_ERROR: ' There was an internal server error',
  WRONG_EMAIL_OR_PASSWORD: 'Wrong email or password',
  VERIFY_EMAIL: 'Please verify first your email address',
  EMAIL_NOT_REGISTERED: 'Email is not registered',
  ITEM_NOT_EXIST: "not found in the database",
  WRONG_PIN_OR_PHONE: 'Wrong phone or pin',
  PHONE_OR_EMAIL_ALREADY_TAKEN: 'Phone number or email already taken by another user',
  PHONE_NOT_FOUND: 'Telephone not found',
  SOMETHING_WENT_WRONG: 'PIN could not be changed. Something went wrong while sending PIN to the telephone',
  PIN_CHANGED_SUCCESSFUL: 'Your new PIN has been sent to your phone number, use it to login',
  EMAIL_NOT_FOUND_RESET_PASSWORD: 'Could not reset password. Email not found',
  RESET_PASSWORD_LINK_SENT: 'Reset password link was sent to your email',
  RESET_PASSWORD_KEY_NOT_AUTHORIZED: 'Reset key not authorized to reset password',
  PASSWORD_SUCCESSFUL_UPDATED: 'Password was successfully updated!',
  TOKEN_EXPIRED: 'Your session has already expired'
};

/* eslint-disable import/prefer-default-export */
import Joi from 'joi';
import { regex } from '../constants';

const abortEarly = false;

export const createUserValidator = Joi.object()
  .keys({
    name: Joi.string().min(3).required(),
    vendorTin: Joi.string().min(3).required(),
    vendorProductOfferings: Joi.array().required(),
    email: Joi.string().email().required(),
    password: Joi.string().required(),
    telephone: Joi.string().regex(regex.phone).length(10),
    address: Joi.string(),
    vendorBio: Joi.string()
  })
  .options({ abortEarly });

export const getProfileValidator = Joi.object().keys({
  userId: Joi.string().guid(),
});

  export const loginUserValidator = Joi.object()
  .keys({
    email: Joi.string().email().required(),
    password: Joi.string().required()
  })
  .options({ abortEarly });


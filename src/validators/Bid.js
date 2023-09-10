import Joi from 'joi';
import { regex } from '../constants';

const abortEarly = false;

export const createBidValidator = Joi.object()
  .keys({
    statmentOfInterest: Joi.string().min(3).required(),
    bidQuotationUrl: Joi.string().regex(regex.url),
    tenderId: Joi.string().guid().required()
  })
  .options({ abortEarly });

import Joi from 'joi';
import { regex } from '../constants';

const abortEarly = false;

export const createRatingValidator = Joi.object()
    .keys({
        score: Joi.number().min(0).max(10).required(),
        vendorId: Joi.string().guid().required(),
        bidId: Joi.string().guid().required()
    })
    .options({ abortEarly });

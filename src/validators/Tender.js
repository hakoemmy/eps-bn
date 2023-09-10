import Joi from 'joi';
import { regex } from '../constants';

const abortEarly = false;

export const createTenderValidator = Joi.object()
  .keys({
    name: Joi.string().min(3).required(),
    tenderDocumentUrl: Joi.string().regex(regex.url)
  })
  .options({ abortEarly });


export const amendTenderValidator = Joi.object()
  .keys({
    name: Joi.string().min(3).required(),
    tenderDocumentUrl: Joi.string().regex(regex.url),
    bidSubmissionDeadline: Joi.date().required(),
    preferredVendorBidScore: Joi.number().required(),
    tenderId: Joi.string().guid().required()
  })
  .options({ abortEarly });

  export const approveOrRejectTenderValidator = Joi.object()
  .keys({
   action: Joi.string().valid('Approved', 'Rejected'),
   tenderId: Joi.string().guid().required()
  })
  .options({ abortEarly });
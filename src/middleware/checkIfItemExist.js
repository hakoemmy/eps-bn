import { statusCodes, errorMessages } from '../constants';
import { sendResult } from '../helpers';
import models from '../models';

export default  (items = [{ modelName: '', hasIdInBody: false, customId: '' }]) => async ({params, body, user}, res, next) => {
    let errors = [];
  await Promise.all(
    items.map(async(item) => {
    let { modelName, hasIdInBody, customId} = item;
    const modelId = customId ? customId : `${modelName?.toLowerCase()}Id`;
    if((hasIdInBody && body[modelId]) || (!hasIdInBody && params[modelId])){
    const foundRecord = await models[modelName]?.findOne({where: {id: hasIdInBody ? body[modelId]: params[modelId] } });
    if(!foundRecord){
      errors.push(modelId);
      }
    }
    }));
    if(errors.length!== 0){
        return sendResult(
            res,
            statusCodes.NOT_FOUND,
            `${errors.join(", ")} ${errorMessages.ITEM_NOT_EXIST}`
          );
    }

    next();
};
